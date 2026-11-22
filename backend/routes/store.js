const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Store = require("../models/Store");
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
 * /api/store:
 *   get:
 *     summary: Devolve os dados da loja
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: Dados da loja
 */
router.get("/", async (req, res, next) => {
  try {
    const loja = await Store.findOne();
    res.json(loja);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/store:
 *   put:
 *     summary: Atualiza (ou cria) os dados da loja, incluindo o logotipo
 *     tags: [Store]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               horarioFuncionamento:
 *                 type: string
 *               logotipo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Loja atualizada
 */
router.put(
  "/",
  auth,
  checkRole(["loja", "admin"]),
  upload.single("logotipo"),
  async (req, res, next) => {
    try {
      const dados = { ...req.body };

      if (req.file) {
        dados.logotipo = `/uploads/${req.file.filename}`;
      }

      const loja = await Store.findOneAndUpdate({}, dados, {
        new: true,
        upsert: true,
      });
      res.json(loja);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
