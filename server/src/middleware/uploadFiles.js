// const multer = require("multer");
// const path = require("path");
// const createError = require("http-errors");
// const {
//   UPLOAD_USER_IMAGE_DIRECTORY,
//   MAX_UPLOAD_FILE_SIZE,
//   ALLOW_UPLOAD_FILE_TYPE,
// } = require("../config");

// const storage = multer.memoryStorage((err) => {
//   console.log(err);
// });

// //disk storage
// //   {
// //   destination: function (req, file, cb) {
// //     cb(null, UPLOAD_USER_IMAGE_DIRECTORY);
// //   },
// //   filename: function (req, file, cb) {
// //     const extName = path.extname(file.originalname);
// //     if (!ALLOW_UPLOAD_FILE_TYPE.includes(extName.substring(1).toLowerCase())) {
// //       return cb(createError(400, "file type not allow"));
// //     }
// //     cb(null, Date.now() + '-' + file.originalname.replace(extName, "") + extName);
// //   }
// // }

// const fileFilter = (req, file, cb) => {
//   console.log("bellal2");
//   if (!file.mimetype.startsWith("image/")) {
//     console.log("bellal");
//     return cb(new Error("Only Images file allow"), false);
//   }
//   if (file.size > MAX_UPLOAD_FILE_SIZE) {
//     return cb(new Error("File size is to large"), false);
//   }
//   if (!ALLOW_UPLOAD_FILE_TYPE.includes(file.mimetype)) {
//     return cb(new Error("File Extension is not allow"), false);
//   }
//   console.log("bellal3");
//   //diskStorage
//   // const extName = path.extname(file.originalname);
//   // if (!ALLOW_UPLOAD_FILE_TYPE.includes(extName.substring(1).toLowerCase())) {
//   //   return cb(createError(400, "file type not allow"), false);
//   // }
//   // cb(null, true);
// };

// const upload = multer({
//   storage: storage,
//   // limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
//   fileFilter: fileFilter,
// });
// console.log(upload);
// module.exports = upload;


const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const {
  UPLOAD_USER_IMAGE_DIRECTORY,
  MAX_UPLOAD_FILE_SIZE,
  ALLOW_UPLOAD_FILE_TYPE,
} = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  if (!ALLOW_UPLOAD_FILE_TYPE.includes(file.mimetype)) {
    return cb(new Error("File extension is not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
  fileFilter: fileFilter,
});

module.exports = upload;

