const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcryptjs");
const createJsonWebToken = require("../helper/jsonWebToken");
const { jsonAccessKey } = require("../secrect");
const handleLogin=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            throw createError(404,"user does't exits.please registration first");
        }


        const isPasswordMatch=await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            throw createError(400,"Email and password is not match");
        }
        if(user.isBanned){
            throw createError(400,"user is banned please contact with ishtiak ahmmed");
        }
        const userPlain = user.toObject();

        // console.log("---------------------------------");
        // console.log(user);
        // console.log("---------------------------------");
        // console.log("---------------------------------");
        // console.log(userPlain);
        // console.log("---------------------------------");
        // Remove the image property from the user object
        delete userPlain.image;
        const accessToken = createJsonWebToken(
             {userPlain},
            jsonAccessKey,
            "15m"
          );
      
          res.cookie("accessToken",accessToken,{
            maxAge : 15*60*1000,
            httpOnly :true,
            secure : true,
            sameSite :'none',
          });
          const userWithoutPassword=await User.findOne({email}).select("-password");
        return successResponse(res, {
            statusCode: 200,
            message: "User login Successfully",
            payload: {
                userWithoutPassword
            },
          });
    } catch (error) {
        next(error);
    }

}
const handleLogout=async(req,res,next)=>{
    try {
       res.clearCookie("accessToken");
        return successResponse(res, {
            statusCode: 200,
            message: "User logout Successfully",
            payload: {
                
            },
          });
    } catch (error) {
        next(error);
    }

}
module.exports={handleLogin,handleLogout};