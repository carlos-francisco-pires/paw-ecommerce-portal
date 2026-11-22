const mongoose = require("mongoose");

const deliveryMethodSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      enum: ["levantamento_loja", "estafeta", "transportadora"],
    },
    custo: { type: Number, required: true, default: 0 },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryMethod", deliveryMethodSchema);
