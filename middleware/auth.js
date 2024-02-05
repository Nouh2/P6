const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN, (err) => {
      if (err) {
        return res.sendStatus(401);
      }
    });
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(401).json({ error: "Error userId" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Error authentification" });
  }
};
