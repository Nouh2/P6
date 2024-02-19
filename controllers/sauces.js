const Sauces = require("../models/Sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauces);
  delete sauceObject._id;
  const sauces = new sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // console.log(sauceObject);
  // console.log(userId);
  // console.log(sauces);
  sauces
    .save()
    .then(() => res.status(201).json({ message: "sauce enregistré" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.seeSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.seeOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id }).then(
    ((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          sauces
            .deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    }).catch((error) => {
      res.status(500).json({ error });
    })
  );
};
