const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new users({
      email: req.body.email,
      password: hash,
    });
    await user.save();
    return res.status(201).json({ message: "User saved" });
  } catch (e) {
    return res.status(500).json({ error: "server error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Login incorrect" });
    }

    const correct = await bcrypt.compare(password, user.password);

    if (!correct) {
      return res.status(401).json({ error: "Login incorrect" });
    }
    return res.status(200).json({
      userToken: user._id,
      token: jwt.sign({ userToken: user._id }, process.env.AUTH_TOKEN, {
        expiresIn: "12H",
      }),
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};
