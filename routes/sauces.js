const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauces");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

router.post("/", auth, multer, saucesCtrl.createSauces);
router.get("/", auth, saucesCtrl.seeSauces);
router.get("/:id", auth, saucesCtrl.seeOneSauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
module.exports = router;
