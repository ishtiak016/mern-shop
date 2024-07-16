const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const { UPLOAD_USER_IMAGE_DIRECTORY, MAX_UPLOAD_FILE_SIZE, ALLOW_UPLOAD_FILE_TYPE } = require("../config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMAGE_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    if (!ALLOW_UPLOAD_FILE_TYPE.includes(extName.substring(1).toLowerCase())) {
      return cb(createError(400, "file type not allow"));
    }
    cb(null, Date.now() + '-' + file.originalname.replace(extName, "") + extName);
  }
});

const fileFilter = (req, file, cb) => {
  const extName = path.extname(file.originalname);
  if (!ALLOW_UPLOAD_FILE_TYPE.includes(extName.substring(1).toLowerCase())) {
    return cb(createError(400, "file type not allow"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
  fileFilter: fileFilter
});

module.exports = upload;
