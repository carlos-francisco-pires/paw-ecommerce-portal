const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");
const checkRole = require("../middleware/CheckRole");

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria uma nova encomenda para o cliente
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: string
 *                       example: 670abc123def75839203857
 *                     quantidade:
 *                       type: integer
 *                       example: 2
 *                     configuracaoEscolhida:
 *                       type: array
 *                       example: []
 *               metodoEntrega:
 *                 type: string
 *                 description: ID de um método de entrega ativo (o custo é lido da base de dados)
 *                 example: 670abc123def73829393948
 *     responses:
 *       201:
 *         description: Encomenda criada com sucesso (custoEntrega vem do método de entrega guardado na base de dados)
 *       400:
 *         description: Stock insuficiente, dados inválidos ou método de entrega inexistente/inativo
 *       404:
 *         description: Algum produto não foi encontrado
 */
router.post("/", auth, orderController.criarEncomenda);

/**
 * @swagger
 * /api/orders/minhas:
 *   get:
 *     summary: Lista as encomendas do cliente autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de encomendas do cliente
 */
router.get("/minhas", auth, orderController.listarMinhasEncomendas);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lista todas as encomendas
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as encomendas
 *       403:
 *         description: Sem permissão
 */
router.get(
  "/",
  auth,
  checkRole(["loja", "admin"]),
  orderController.listarEncomendas
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Devolve uma encomenda específica
 *     tags: [Orders]
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
 *         description: Encomenda encontrada
 *       404:
 *         description: Encomenda não encontrada
 */
router.get("/:id", auth, async (req, res, next) => {
  try {
    const compra = await Order.findById(req.params.id)
      .populate("itens.produto")
      .populate("metodoEntrega");
    if (!compra)
      return res.status(404).json({ message: "Compra não encontrada" });
    res.json(compra);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/orders/{id}/confirmar:
 *   patch:
 *     summary: Confirma uma encomenda pendente
 *     tags: [Orders]
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
 *         description: Encomenda confirmada
 *       400:
 *         description: Esta encomenda já não está pendente
 *       404:
 *         description: Encomenda não encontrada
 */
router.patch(
  "/:id/confirmar",
  auth,
  checkRole(["loja", "admin"]),
  orderController.confirmarEncomenda
);

/**
 * @swagger
 * /api/orders/{id}/cancelar:
 *   patch:
 *     summary: Cancela uma encomenda só até 10 min se já confirmada
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da encomenda
 *     responses:
 *       200:
 *         description: Encomenda cancelada com sucesso
 *       400:
 *         description: Já passaram mais de 10 minutos, ou estado não permite cancelar
 *       403:
 *         description: A encomenda não pertence a este cliente
 *       404:
 *         description: Encomenda não encontrada
 */
router.patch("/:id/cancelar", auth, orderController.cancelarEncomenda);

module.exports = router;
