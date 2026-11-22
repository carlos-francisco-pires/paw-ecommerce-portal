const mongoose = require("mongoose");

const itemEncomendaSchema = new mongoose.Schema(
  {
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantidade: { type: Number, required: true, min: 1 },
    configuracaoEscolhida: [
      {
        nome: String,
        valorEscolhido: String,
      },
    ],
    precoUnitario: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itens: [itemEncomendaSchema],
    total: { type: Number, required: true },
    metodoEntrega: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMethod",
      required: true,
    },
    custoEntrega: { type: Number, required: true, default: 0 },
    estado: {
      type: String,
      enum: [
        "pendente",
        "confirmada",
        "em_preparacao",
        "em_entrega",
        "entregue",
        "cancelada",
      ],
      default: "pendente",
    },
    estafeta: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dataConfirmacao: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
