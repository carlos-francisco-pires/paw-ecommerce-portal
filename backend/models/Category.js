const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    categoriaPai: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
