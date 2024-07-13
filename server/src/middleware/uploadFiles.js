const multer =require ("multer");
const path =require ("path");
const createError=require("http-errors");
const UPOLAD_DIR=process.env.UPOLAD_DIR|| '';
const MAX_UPLOAD_FILE_SIZE=Number(process.env.MAX_UPLOAD_FILE_SIZE);
const UPLOAD_FILE_ALLOW_TYPE=process.env.ALLOW_UPLOAD_FILE_TYPE;
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, UPOLAD_DIR)
    },
    filename: function (req, file, cb) {
      const extName=path.extname(file.originalname);
      if(!UPLOAD_FILE_ALLOW_TYPE.includes(extName.substring(1))){
        return cb(createError(400,"file type not allow"));
      }
      cb(null,Date.now() + '-'+ file.originalname.replace(extName,"")+extName);
    }
  })
  const fileFilter=()=>{
    const extName=path.extname(file.originalname);
    if(!UPLOAD_FILE_ALLOW_TYPE.includes(extName.substring(1))){
      return cb(createError(400,"file type not allow"));
    }
    return(null,true);
  }
  
  const upload = multer({ storage: storage ,
    limits:{fileSize:MAX_UPLOAD_FILE_SIZE,fileFilter}
  });

  module.exports=upload;