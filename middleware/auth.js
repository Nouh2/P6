const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.AUTH_TOKEN);
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("Invalid user ID");
    }
    return next();
  } catch (error) {
    res.status(401).json({ error: "Error authentification" });
  }
};
