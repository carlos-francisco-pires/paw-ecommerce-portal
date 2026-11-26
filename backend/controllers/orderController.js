const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const DeliveryMethod = require("../models/DeliveryMethod");

exports.listarEncomendas = async (req, res, next) => {
  try {
    const encomendas = await Order.find()
      .populate("itens.produto")
      .populate("metodoEntrega");
    res.json(encomendas);
  } catch (err) {
    next(err);
  }
};

exports.listarMinhasEncomendas = async (req, res, next) => {
  try {
    const encomendas = await Order.find({ cliente: req.user.id })
      .populate("itens.produto")
      .populate("metodoEntrega");
    res.json(encomendas);
  } catch (err) {
    next(err);
  }
};

exports.criarEncomenda = async (req, res, next) => {
  try {
    const clienteId = req.user.id;
    // custoEntrega is ignored on purpose: the delivery cost always comes from the database
    const { itens, metodoEntrega } = req.body;

    // Validate the items before any database work or stock change
    if (!Array.isArray(itens) || itens.length === 0) {
      return res
        .status(400)
        .json({ message: "A encomenda tem de ter pelo menos um item" });
    }

    for (let i = 0; i < itens.length; i++) {
      const item = itens[i];
      if (!item || !Number.isInteger(item.quantidade) || item.quantidade < 1) {
        return res.status(400).json({
          message: `Item ${i + 1} (produto ${item?.produtoId}): a quantidade tem de ser um número inteiro maior ou igual a 1`,
        });
      }
    }

    // Validate the delivery method before touching any stock
    if (!mongoose.isValidObjectId(metodoEntrega)) {
      return res.status(400).json({ message: "Método de entrega inválido" });
    }

    const metodo = await DeliveryMethod.findById(metodoEntrega);

    if (!metodo || !metodo.ativo) {
      return res
        .status(400)
        .json({ message: "Método de entrega inexistente ou inativo" });
    }

    const custoEntrega = metodo.custo;

    const itensProcessados = [];
    for (const item of itens) {
      const produto = await Product.findById(item.produtoId);

      if (!produto) {
        return res
          .status(404)
          .json({ message: `Produto ${item.produtoId} não encontrado` });
      }

      if (item.quantidade > produto.stock) {
        return res.status(400).json({
          message: `Produto ${item.produtoId} não tem stock suficiente`,
        });
      }

      let precoUnidade = produto.preco;

      if (produto.configuravel) {
        for (const escolha of item.configuracaoEscolhida) {
          const encontraOpcao = produto.opcoesConfiguracao.find(
            (opcao) => opcao.nome === escolha.nome
          );
          const encontraValor = encontraOpcao.valores.find(
            (valor) => valor.nome === escolha.valorEscolhido
          );

          precoUnidade += encontraValor.precoExtra;
        }
      }

      itensProcessados.push({
        produto: produto._id,
        quantidade: item.quantidade,
        configuracaoEscolhida: item.configuracaoEscolhida || [],
        precoUnitario: precoUnidade,
      });
    }

    let total = 0;

    for (const itemProcessado of itensProcessados) {
      await Product.findByIdAndUpdate(itemProcessado.produto, {
        $inc: { stock: -itemProcessado.quantidade },
      });
      total += itemProcessado.precoUnitario * itemProcessado.quantidade;
    }

    total += custoEntrega;

    const encomenda = await Order.create({
      cliente: clienteId,
      itens: itensProcessados,
      total,
      metodoEntrega: metodo._id,
      custoEntrega,
    });

    res.status(201).json(encomenda);
  } catch (err) {
    next(err);
  }
};

exports.confirmarEncomenda = async (req, res, next) => {
  try {
    const encomenda = await Order.findById(req.params.id);

    if (!encomenda) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    if (encomenda.estado !== "pendente") {
      return res
        .status(400)
        .json({ message: "Esta encomenda já não está pendente" });
    }

    encomenda.estado = "confirmada";
    encomenda.dataConfirmacao = new Date();
    await encomenda.save();
    res.json(encomenda);
  } catch (err) {
    next(err);
  }
};

exports.cancelarEncomenda = async (req, res, next) => {
  try {
    const encomenda = await Order.findById(req.params.id);

    if (!encomenda) {
      return res.status(404).json({ message: "Encomenda não encontrada" });
    }

    if (encomenda.cliente.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Não podes cancelar uma encomenda que não é tua" });
    }

    if (encomenda.estado === "pendente") {
      encomenda.estado = "cancelada";
      await encomenda.save();
      return res.json(encomenda);
    }

    if (encomenda.estado === "confirmada") {
      const dezMinutosEmMs = 10 * 60 * 1000;
      const tempoPassado =
        Date.now() - new Date(encomenda.dataConfirmacao).getTime();

      if (tempoPassado > dezMinutosEmMs) {
        return res
          .status(400)
          .json({ message: "Já se passaram mais de 10 minutos" });
      }

      encomenda.estado = "cancelada";
      await encomenda.save();
      return res.json(encomenda);
    }
    return res
      .status(400)
      .json({ message: "O estado da encomenda não permite cancelar" });
  } catch (err) {
    next(err);
  }
};
