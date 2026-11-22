const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/CheckRole");

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const nomeUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nomeUnico);
  },
});
const upload = multer({ storage });
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista produtos pesquisa, filtro por categoria, ordenação e paginação
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Pesquisa por nome ou ean
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: id da categoria para filtrar
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: Lista de produtos
 */
router.get("/", async (req, res, next) => {
  try {
    const { search, categoria, sort, page = 1, limit = 12 } = req.query;

    const filtro = {};
    if (search) {
      filtro.$or = [
        { nome: { $regex: search, $options: "i" } },
        { ean: { $regex: search, $options: "i" } },
      ];
    }
    if (categoria) filtro.categoria = categoria;

    let ordenacao = {};
    if (sort === "price_asc") ordenacao.preco = 1;
    if (sort === "price_desc") ordenacao.preco = -1;

    const skip = (Number(page) - 1) * Number(limit);

    const [produtos, total] = await Promise.all([
      Product.find(filtro)
        .populate("categoria")
        .sort(ordenacao)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filtro),
    ]);

    res.json({
      produtos,
      total,
      totalPaginas: Math.ceil(total / Number(limit)),
      paginaAtual: Number(page),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: detalhes de um produto por id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get("/:id", async (req, res, next) => {
  try {
    const produto = await Product.findById(req.params.id).populate("categoria");
    if (!produto)
      return res.status(404).json({ message: "Produto não encontrado" });
    res.json(produto);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               ean:
 *                 type: string
 *                 example: "1234567890123"
 *               nome:
 *                 type: string
 *                 example: Rato HP
 *               descricao:
 *                 type: string
 *                 example: Rato sem fios
 *               categoria:
 *                 type: string
 *                 example: 670abc123def456789012345
 *               preco:
 *                 type: number
 *                 example: 10
 *               stock:
 *                 type: integer
 *                 example: 16
 *               configuravel:
 *                 type: boolean
 *                 example: false
 *               imagemDestaque:
 *                 type: string
 *                 format: binary
 *               imagensAdicionais:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       403:
 *         description: Sem permissão não é loja ou admin
 */
router.post(
  "/",
  auth,
  checkRole(["loja", "admin"]),
  upload.fields([
    { name: "imagemDestaque", maxCount: 1 },
    { name: "imagensAdicionais", maxCount: 3 },
  ]),
  async (req, res, next) => {
    try {
      const dados = { ...req.body };

      if (req.files?.imagemDestaque) {
        dados.imagemDestaque = `/uploads/${req.files.imagemDestaque[0].filename}`;
      }
      if (req.files?.imagensAdicionais) {
        dados.imagensAdicionais = req.files.imagensAdicionais.map(
          (f) => `/uploads/${f.filename}`
        );
      }
      if (dados.opcoesConfiguracao) {
        dados.opcoesConfiguracao = JSON.parse(dados.opcoesConfiguracao);
      }
      if (dados.configuravel !== undefined) {
        dados.configuravel = dados.configuravel === "true";
      }

      const produto = await Product.create(dados);
      res.status(201).json(produto);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Edita um produto
 *     tags: [Products]
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
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const produto = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!produto)
        return res.status(404).json({ message: "Produto não encontrado" });
      res.json(produto);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Products]
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
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  "/:id",
  auth,
  checkRole(["loja", "admin"]),
  async (req, res, next) => {
    try {
      const produto = await Product.findByIdAndDelete(req.params.id);
      if (!produto)
        return res.status(404).json({ message: "Produto não encontrado" });
      res.json({ message: "Produto removido" });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
