const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcryptjs");
const createJsonWebToken = require("../helper/jsonWebToken");
const { jsonAccessKey, jsonRefreshKey } = require("../secrect");
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

  
        delete userPlain.image;
        const accessToken = createJsonWebToken(
             {userPlain},
            jsonAccessKey,
            "1m"
          );
          res.cookie("accessToken",accessToken,{
            maxAge : 1*60*1000,
            httpOnly :true,
            secure : true,
            sameSite :'none',
          });
          const refreshToken = createJsonWebToken(
            {userPlain},
           jsonRefreshKey,
           "7d"
         );
       
          res.cookie("refreshToken",refreshToken,{
            maxAge : 7*24*60*60*1000,
            httpOnly :true,
            secure : true,
            sameSite :'none',
          });
          
          const userWithoutPassword=await User.findOne({email}).select("-password");
        return successResponse(res, {
            statusCode: 200,
            message: "User login Successfully",
            payload: {
               user: userWithoutPassword
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

const handleRefreshToken=async(req,res,next)=>{
    try {
        const oldRefreshToken=req.cookies.refreshToken;
        const decodeToken=jwt.verify(oldRefreshToken,jsonRefreshKey);
      
        if(!decodeToken){
            throw createError(404,"token not found");
        }
   
        const accessToken = createJsonWebToken(
           decodeToken.userPlain,
           jsonAccessKey,
           "1m"
         );
   
         res.cookie("accessToken",accessToken,{
           maxAge : 1*60*1000,
           httpOnly :true,
           secure : true,
           sameSite :'none',
         });
       
        return successResponse(res, {
            statusCode: 200,
            message: "new access token genrate",
            payload: { accessToken },
          });
    } catch (error) {
        next(error);
    }

}

const handleProtectedToken=async(req,res,next)=>{
    try {
        const accessToken=req.cookies.accessToken;
        const decodeToken=jwt.verify(accessToken,jsonAccessKey);
      
        if(!decodeToken){
            throw createError(404,"token not found");
        }
 
       
        return successResponse(res, {
            statusCode: 200,
            message: "protected resouce verify token",
            payload: { accessToken },
          });
    } catch (error) {
        next(error);
    }

}

module.exports={handleLogin,handleLogout,handleRefreshToken,handleProtectedToken};