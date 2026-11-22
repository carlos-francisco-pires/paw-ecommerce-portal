const express = require("express");
const router = express.Router();
const DeliveryMethod = require("../models/DeliveryMethod");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/CheckRole");
const Order = require("../models/Order");

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Lista os métodos de entrega disponíveis
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Lista de métodos de entrega
 */
router.get("/", async (req, res, next) => {
  try {
    const metodos = await DeliveryMethod.find();
    res.json(metodos);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Cria um novo método de entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: estafeta
 *               custo:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Método de entrega criado
 */
router.post("/", auth, checkRole(["loja", "admin"]), async (req, res, next) => {
  try {
    const dados = { ...req.body };
    const metodo = await DeliveryMethod.create(dados);
    res.status(201).json(metodo);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/deliveries/{id}:
 *   put:
 *     summary: Edita um método de entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: estafeta
 *               custo:
 *                 type: number
 *                 example: 6
 *     responses:
 *       200:
 *         description: Método de entrega atualizado
 *       404:
 *         description: Método não encontrado
 */
router.put(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const metodo = await DeliveryMethod.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!metodo)
        return res.status(404).json({ message: "Método não encontrado" });
      res.json(metodo);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     summary: Remove um método de entrega
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Método de entrega removido
 *       404:
 *         description: Método não encontrado
 */
router.delete(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const metodo = await DeliveryMethod.findByIdAndDelete(req.params.id);
      if (!metodo)
        return res.status(404).json({ message: "Método não encontrado" });
      res.json({ message: "Método removido" });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/deliveries/disponiveis:
 *   get:
 *     summary: Lista encomendas confirmadas ainda sem estafeta atribuído
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de encomendas disponíveis para entrega
 */
router.get(
  "/disponiveis",
  auth,
  checkRole(["estafeta"]),
  async (req, res, next) => {
    try {
      const encomendas = await Order.find({
        estado: "confirmada",
        estafeta: null,
      })
        .populate("cliente", "nome morada telefone")
        .populate("itens.produto")
        .populate("metodoEntrega");
      res.json(encomendas);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/deliveries/minha-atual:
 *   get:
 *     summary: Devolve a entrega atual do estafeta autenticado, se houver
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Entrega atual ou null
 */
router.get(
  "/minha-atual",
  auth,
  checkRole(["estafeta"]),
  async (req, res, next) => {
    try {
      const encomenda = await Order.findOne({
        estafeta: req.user.id,
        estado: "em_entrega",
      })
        .populate("cliente", "nome morada telefone")
        .populate("itens.produto")
        .populate("metodoEntrega");
      res.json(encomenda);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/deliveries/{id}/aceitar:
 *   patch:
 *     summary: Estafeta aceita uma encomenda para entregar
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Encomenda aceite
 *       400:
 *         description: Estafeta já tem entrega ativa, ou encomenda indisponível
 *       404:
 *         description: Encomenda não encontrada
 */
router.patch(
  "/:id/aceitar",
  auth,
  checkRole(["estafeta"]),
  async (req, res, next) => {
    try {
      const verificacao = await Order.findOne({
        estafeta: req.user.id,
        estado: "em_entrega",
      });
      if (verificacao)
        return res
          .status(400)
          .json({ message: "O estafeta já tem uma encomenda ativa" });

      const encomenda = await Order.findById(req.params.id)
        .populate("itens.produto")
        .populate("metodoEntrega");
      if (!encomenda)
        return res.status(404).json({ message: "Encomenda não encontrada" });

      if (encomenda.estado !== "confirmada" || encomenda.estafeta !== null) {
        return res
          .status(400)
          .json({ message: "Esta encomenda não está disponível" });
      }

      encomenda.estafeta = req.user.id;
      encomenda.estado = "em_entrega";
      await encomenda.save();
      res.json(encomenda);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/deliveries/{id}/entregar:
 *   patch:
 *     summary: Estafeta marca a encomenda como entregue
 *     tags: [Deliveries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Encomenda marcada como entregue
 *       403:
 *         description: Encomenda não atribuída a este estafeta
 *       404:
 *         description: Encomenda não encontrada
 */
router.patch(
  "/:id/entregar",
  auth,
  checkRole(["estafeta"]),
  async (req, res, next) => {
    try {
      const encomenda = await Order.findById(req.params.id);
      if (!encomenda)
        return res.status(404).json({ message: "Encomenda não encontrada" });

      if (encomenda.estafeta?.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Esta encomenda não está atribuída a ti" });
      }

      if (encomenda.estado !== "em_entrega") {
        return res
          .status(400)
          .json({ message: "Esta encomenda não está em entrega" });
      }

      encomenda.estado = "entregue";
      await encomenda.save();
      res.json(encomenda);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
