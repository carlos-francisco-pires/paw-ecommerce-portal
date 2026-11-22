const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/CheckRole");

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Dashboard do administrador - número de utilizadores e total de encomendas
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do administrador
 *       403:
 *         description: Sem permissão (não é admin)
 */
router.get("/admin", auth, checkRole(["admin"]), async (req, res, next) => {
  try {
    const numUtilizadores = await User.countDocuments();
    const totalEncomendas = await Order.countDocuments();

    res.json({ numUtilizadores, totalEncomendas });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/dashboard/loja:
 *   get:
 *     summary: Dashboard da loja - número de encomendas e produtos mais vendidos
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas da loja, incluindo top 5 produtos mais vendidos
 *       403:
 *         description: Sem permissão (não é loja/admin)
 */
router.get(
  "/loja",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const numEncomendas = await Order.countDocuments();

      const produtosMaisVendidos = await Order.aggregate([
        { $unwind: "$itens" },
        {
          $group: {
            _id: "$itens.produto",
            totalVendido: { $sum: "$itens.quantidade" },
          },
        },
        { $sort: { totalVendido: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "produto",
          },
        },
        { $unwind: "$produto" },
        {
          $project: {
            _id: 0,
            nome: "$produto.nome",
            totalVendido: 1,
          },
        },
      ]);

      res.json({ numEncomendas, produtosMaisVendidos });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/dashboard/cliente:
 *   get:
 *     summary: Dashboard do cliente - número de encomendas e produtos mais comprados
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do cliente autenticado
 */
router.get("/cliente", auth, async (req, res, next) => {
  try {
    const mongoose = require("mongoose");
    const clienteId = new mongoose.Types.ObjectId(req.user.id);

    const numEncomendas = await Order.countDocuments({ cliente: clienteId });

    const produtosMaisComprados = await Order.aggregate([
      { $match: { cliente: clienteId } },
      { $unwind: "$itens" },
      {
        $group: {
          _id: "$itens.produto",
          totalComprado: { $sum: "$itens.quantidade" },
        },
      },
      { $sort: { totalComprado: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "produto",
        },
      },
      { $unwind: "$produto" },
      {
        $project: {
          _id: 0,
          nome: "$produto.nome",
          totalComprado: 1,
        },
      },
    ]);

    res.json({ numEncomendas, produtosMaisComprados });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/dashboard/estafeta:
 *   get:
 *     summary: Dashboard do estafeta - número de entregas e valor a receber
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas do estafeta autenticado
 */
router.get(
  "/estafeta",
  auth,
  checkRole(["estafeta"]),
  async (req, res, next) => {
    try {
      const numEntregas = await Order.countDocuments({
        estafeta: req.user.id,
        estado: "entregue",
      });

      const encomendasEntregues = await Order.find({
        estafeta: req.user.id,
        estado: "entregue",
      });

      let valorAReceber = 0;
      for (const encomenda of encomendasEntregues) {
        valorAReceber += encomenda.custoEntrega;
      }

      res.json({ numEntregas, valorAReceber });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
