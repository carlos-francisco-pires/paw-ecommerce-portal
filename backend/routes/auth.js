const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Regista um novo utilizador só clientes ou estafetas
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Carlos Pires
 *               email:
 *                 type: string
 *                 example: carlosnovo@teste.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *               morada:
 *                 type: string
 *                 example: Rua Nova, 349
 *               telefone:
 *                 type: string
 *                 example: "917234898"
 *               role:
 *                 type: string
 *                 example: cliente
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso, devolve o token
 *       400:
 *         description: Faltam campos obrigatórios
 *       409:
 *         description: Já existe uma conta com este email
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Permite efetuar login e devolve um token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: carlos@teste.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso, devolve o token
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Altera a password do utilizador
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordAtual:
 *                 type: string
 *                 example: "123456"
 *               novaPassword:
 *                 type: string
 *                 example: "nova123"
 *     responses:
 *       200:
 *         description: Password alterada com sucesso
 *       400:
 *         description: Password atual incorreta
 */
router.patch("/change-password", auth, authController.changePassword);

module.exports = router;
