const Order = require("../models/Order");
const Product = require("../models/Product");

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
    const { itens, metodoEntrega, custoEntrega } = req.body;

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

    total += Number(custoEntrega);

    const encomenda = await Order.create({
      cliente: clienteId,
      itens: itensProcessados,
      total,
      metodoEntrega,
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
