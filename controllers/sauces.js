const Sauces = require("../models/Sauces");
const fs = require("fs");

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauces = new Sauces({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

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
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(404).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;

  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        console.log(req.body.userId);
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id, userId: req.auth.userId }
          )
            .then(() => res.status(200).json({ message: "Sauce edited!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.likeSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id }).then((sauce) => {
    const like = req.body.like;
    if (like === 1) {
      let { likes, usersLiked } = sauce;
      const userId = req.body.userId;
      const sauceId = req.params.id;
      if (usersLiked.includes(userId))
        return res
          .status(400)
          .json({ message: "Vous avez déjà liké cette sauce" });
      Sauces.updateOne(
        { _id: sauceId },
        { $inc: { likes: +1 }, $push: { usersLiked: userId } }
      )
        .then(() => res.status(200).json({ message: "Like ajouté" }))
        .catch((error) => res.status(400).json({ error }));
    }

    if (like === 0) {
      let { likes, dislikes, usersLiked, usersDisliked } = sauce;
      const userId = req.body.userId;
      const sauceId = req.params.id;
      if (usersLiked.includes(userId)) {
        Sauces.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        )
          .then(() => res.status(200).json({ message: "Like retiré" }))
          .catch((error) => res.status(400).json({ error }));
      }
      if (usersDisliked.includes(userId)) {
        Sauces.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        )
          .then(() => res.status(200).json({ message: "Dislike retiré" }))
          .catch((error) => res.status(400).json({ error }));
      }
    }

    if (like === -1) {
      let { dislikes, usersDisliked } = sauce;
      const userId = req.body.userId;
      const sauceId = req.params.id;
      if (usersDisliked.includes(userId))
        return res
          .status(400)
          .json({ message: "Vous avez déjà disliké cette sauce" });

      Sauces.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: +1 },
          $push: { usersDisliked: userId },
        }
      )
        .then(() => res.status(200).json({ message: "Dislike ajouté" }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};
