const mongoose = require("mongoose");
const users = require("../models/users");

exports.signup = (req, res, next) => {
  const user = new users({
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((res) => console.log("user enregistré", res))
    .catch((Error) => console.log("user pas enregistré"));

  res.send({ message: "Utilisateur enregistré" });
};
