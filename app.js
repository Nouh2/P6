const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const users = require("./models/users");
const usersRoutes = require("./routes/users");

app.use(cors());
app.use(express.json());
app.use(usersRoutes);
app.use(users);

mongoose
  .connect(
    "mongodb+srv://Nouh:Gamerfou1@cluster0.qyzrsn5.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//app.use(bodyParser.json());

module.exports = app;
