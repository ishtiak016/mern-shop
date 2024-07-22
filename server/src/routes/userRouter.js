const express =require("express");
const {getUsers, getUserById, deleteUserById, processRegister, activateUserAccount, updateUserById, handleManageUserById, updateUserPassword, handleForgotPassword, resetUserPassword} = require("../controllers/userController");
const upload = require("../middleware/uploadFiles");
const { validedUserRegistraTion, validedUserUpdatePassword, validedUserForgotPassword, validedUserresetPassword } = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLogedIn, isLogedOut, isAdmin } = require("../middleware/auth");

const userRouter=express.Router();


userRouter.post('/process-register',upload.single("image"),isLogedOut,validedUserRegistraTion,runValidation,processRegister);
userRouter.post('/verify',isLogedOut,activateUserAccount);
userRouter.get('/',isLogedIn,isAdmin,getUsers);
userRouter.get('/:id',isLogedIn,getUserById);
userRouter.delete('/:id',isLogedIn,deleteUserById);

userRouter.put("/reset-password/",validedUserresetPassword,runValidation,resetUserPassword);
userRouter.put('/:id',upload.single("image"),isLogedIn,updateUserById);
userRouter.put("/manage-user/:id",isLogedIn,isAdmin,handleManageUserById);
userRouter.put("/password-update/:id",isLogedIn,validedUserUpdatePassword,runValidation,updateUserPassword);
userRouter.post("/forget-password/",validedUserForgotPassword,runValidation,handleForgotPassword);


module.exports=userRouter;