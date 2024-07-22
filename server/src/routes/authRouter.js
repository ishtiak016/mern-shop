const express =require("express");
const { runValidation } = require("../validators");
const {handleLogin,handleLogout, handleRefreshToken, handleProtectedToken} = require("../controllers/authController");
const { isLogedOut, isLogedIn } = require("../middleware/auth");
const { validedUserLogin } = require("../validators/auth");
const { handleBanUserById1 } = require("../controllers/userController");

const authRouter=express.Router();

authRouter.post("/login",validedUserLogin,runValidation,isLogedOut,handleLogin);

authRouter.post("/logout",isLogedIn,handleLogout);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.get("/protect-token", handleProtectedToken);
module.exports=authRouter;