const mongoose = require("mongoose");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new users({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((res) => console.log("user enregistré", res))
      .catch((error) => console.log(error));

    res.send({ message: "Utilisateur enregistré" });
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  users
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Email incorrect" });
      } else {
        bcrypt.compare(password, user.password).then((correct) => {
          if (!correct) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          } else {
            res.status(200).json({
              userToken: user._id,
              token: jwt.sign({ userToken: user._id }, process.env.AUTH_TOKEN, {
                expiresIn: "1H",
              }),
            });
          }
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(401).json({ error });
    });
};
