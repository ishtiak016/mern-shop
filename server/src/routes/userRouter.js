const express =require("express");
const {getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById} = require("../controllers/userController");
const upload = require("../middleware/uploadFiles");
const { validedUserRegistraTion } = require("../validators/auth");
const { runValidation } = require("../validators");

const userRouter=express.Router();


userRouter.post('/process-register',upload.single("image"),validedUserRegistraTion,runValidation,processRegister);
userRouter.post('/verify',activateUserAccount);
userRouter.get('/',getUsers);
userRouter.get('/:id',getUserById);
userRouter.delete('/:id',deleteUserById);
userRouter.put('/:id',upload.single("image"),updateUserById);


module.exports=userRouter;