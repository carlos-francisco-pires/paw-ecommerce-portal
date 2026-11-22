const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/CheckRole");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lista todos os utilizadores
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de utilizadores só sem as passwords
 */
router.get("/", auth, checkRole(["admin"]), async (req, res, next) => {
  try {
    const utilizador = await User.find().select("-password");
    res.json(utilizador);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Devolve os dados do utilizador autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do utilizador
 */
router.get("/me", auth, async (req, res, next) => {
  try {
    const utilizador = await User.findById(req.user.id).select("-password");
    if (!utilizador)
      return res.status(404).json({ message: "Utilizador não encontrado" });
    res.json(utilizador);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/users/{id}/aprovar:
 *   patch:
 *     summary: Aprova um utilizador estafeta
 *     tags: [Users]
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
 *         description: Estafeta aprovado
 *       400:
 *         description: O utilizador não é estafeta
 *       404:
 *         description: Utilizador não encontrado
 */
router.patch(
  "/:id/aprovar",
  auth,
  checkRole(["admin"]),
  async (req, res, next) => {
    try {
      const utilizador = await User.findById(req.params.id);
      if (!utilizador)
        return res.status(404).json({ message: "Utilizador não encontrado" });
      if (utilizador.role !== "estafeta") {
        return res.status(400).json({ message: "O utilizador não é estafeta" });
      }
      utilizador.aprovado = true;
      await utilizador.save();
      res.json(utilizador);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
