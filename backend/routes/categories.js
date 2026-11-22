const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/CheckRole");

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get("/", async (req, res, next) => {
  try {
    const categorias = await Category.find().populate("categoriaPai");
    res.json(categorias);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Devolve uma categoria específica
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get("/:id", async (req, res, next) => {
  try {
    const categoria = await Category.findById(req.params.id).populate(
      "categoriaPai"
    );
    if (!categoria)
      return res.status(404).json({ message: "Categoria não encontrada" });
    res.json(categoria);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categories]
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
 *                 example: Computadores
 *               categoriaPai:
 *                 type: string
 *                 example: null
 *     responses:
 *       201:
 *         description: Categoria criada
 */
router.post("/", auth, checkRole(["loja", "admin"]), async (req, res, next) => {
  try {
    const dados = { ...req.body };
    const categoria = await Category.create(dados);
    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Edita uma categoria
 *     tags: [Categories]
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
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
router.put(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const categoria = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!categoria)
        return res.status(404).json({ message: "Categoria não encontrada" });
      res.json(categoria);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categories]
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
 *         description: Categoria removida
 *       404:
 *         description: Categoria não encontrada
 */
router.delete(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const categoria = await Category.findByIdAndDelete(req.params.id);
      if (!categoria)
        return res.status(404).json({ message: "Categoria não encontrada" });
      res.json({ message: "Categoria removida" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
