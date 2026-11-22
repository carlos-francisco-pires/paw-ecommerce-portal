const mongoose = require("mongoose");

const opcaoValorSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    precoExtra: { type: Number, default: 0 },
  },
  { _id: false }
);

const opcaoConfiguracaoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    valores: [opcaoValorSchema],
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    ean: { type: String, required: true, unique: true },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    preco: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    imagemDestaque: { type: String },
    imagensAdicionais: [{ type: String }],
    configuravel: { type: Boolean, default: false },
    opcoesConfiguracao: [opcaoConfiguracaoSchema],
  },
  { timestamps: true }
);

productSchema.index({ nome: "text" });

module.exports = mongoose.model("Product", productSchema);
