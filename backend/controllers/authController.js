const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function gerarToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

exports.register = async (req, res, next) => {
  try {
    const { nome, email, password, morada, telefone, role } = req.body;

    if (!nome || !email || !password || !morada || !telefone) {
      return res.status(400).json({ message: 'Preenche todos os campos obrigatórios' });
    }

    const existente = await User.findOne({ email });
    if (existente) {
      return res.status(409).json({ message: 'Já existe uma conta com este email' });
    }

    const roleFinal = ['cliente', 'estafeta'].includes(role) ? role : 'cliente';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      nome,
      email,
      password: passwordHash,
      morada,
      telefone,
      role: roleFinal,
    });

    const token = gerarToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role, aprovado: user.aprovado },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const passwordCorreta = await bcrypt.compare(password, user.password);
    if (!passwordCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.role === 'estafeta' && !user.aprovado) {
      return res.status(403).json({ message: 'A tua conta de estafeta ainda não foi aprovada pelo administrador' });
    }

    const token = gerarToken(user);

    res.json({
      token,
      user: { id: user._id, nome: user.nome, email: user.email, role: user.role, aprovado: user.aprovado },
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { passwordAtual, novaPassword } = req.body;
    const user = await User.findById(req.user.id);

    const correta = await bcrypt.compare(passwordAtual, user.password);
    if (!correta) {
      return res.status(400).json({ message: 'Password atual incorreta' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(novaPassword, salt);
    await user.save();

    res.json({ message: 'Password alterada com sucesso' });
  } catch (err) {
    next(err);
  }
};