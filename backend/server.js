require("dotenv").config();
const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

//cria o express
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//liga as rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/deliveries", require("./routes/deliveries"));
app.use("/api/store", require("./routes/store"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/dashboard", require("./routes/dashboard"));

app.get("/", (req, res) => {
  res.json({ message: "API PAW e-commerce a funcionar" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;

//ligar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Ligado ao MongoDB");
    app.listen(PORT, () =>
      console.log(`Servidor a correr em http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Erro ao ligar ao MongoDB:", err.message);
    process.exit(1);
  });
