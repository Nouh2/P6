const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const users = require("./models/users");
const usersRoutes = require("./routes/users");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(usersRoutes);
app.use(users);

mongoose
  .connect(
    "mongodb+srv://" + process.env.MONGO + "/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//app.use(bodyParser.json());
app.post("/api/auth", usersRoutes);

module.exports = app;
