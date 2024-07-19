const express =require("express");
const { runValidation } = require("../validators");
const {handleLogin,handleLogout} = require("../controllers/authController");
const { isLogedOut, isLogedIn } = require("../middleware/auth");
const { validedUserLogin } = require("../validators/auth");
const { handleBanUserById1 } = require("../controllers/userController");

const authRouter=express.Router();

authRouter.post("/login",validedUserLogin,runValidation,isLogedOut,handleLogin);

authRouter.post("/logout",isLogedIn,handleLogout);


module.exports=authRouter;