const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "/public/uploads"),
//   filename: function (req, file, cb) {
//     const fullName =
//       "blog_" + uuid4().replace(/-/g, "") + path.extname(file.originalname);
//     cb(null, fullName);
//   },
// });
// const upload = multer({ storage: storage });

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
