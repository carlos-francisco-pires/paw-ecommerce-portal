const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    logotipo: { type: String },
    horarioFuncionamento: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
