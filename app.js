const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const usersRoutes = require("./routes/users");
const saucesRoutes = require("./routes/sauces");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://" + process.env.MONGO + "/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//app.use(bodyParser.json());
app.use("/api/auth", usersRoutes);
app.use("/api/auth", saucesRoutes);

module.exports = app;
