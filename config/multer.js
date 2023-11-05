const multer = require("multer");
const path = require("path");
const crypto = require("node:crypto");

const playerPhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storage/photos/');
    },
    filename: (req, file, cb) => {
        cb(null, `${crypto.randomUUID()}` + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    }
    else {
      cb(new Error("You can only upload an image"), false);
    }
  
  }

const uploadPlayerPhoto = multer({storage: playerPhotoStorage, limits: { fileSize: 524288 }, fileFilter: fileFilter}).fields([
    {name: 'new_photo', maxCount: '1'},
  ]);

module.exports = {
  uploadPlayerPhoto
};