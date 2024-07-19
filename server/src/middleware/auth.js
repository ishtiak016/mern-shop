const createError=require("http-errors")
const jwt =require("jsonwebtoken");
const { jsonAccessKey } = require("../secrect");
const isLogedIn=async(req,res,next)=>{
try {
    const accessToken=req.cookies.accessToken;
    if(!accessToken){
        throw createError(404,"Access Token Not Found .please login");
    }
    const decode=jwt.verify(accessToken,jsonAccessKey);
    if(!decode){
        throw createError(404,"Decoded Fail Please Login");
    }
   
    req.user=decode.userPlain;
    next();
} catch (error) {
    return next(error);
}

}
const isLogedOut=async(req,res,next)=>{
    try {
        const accessToken=req.cookies.accessToken;
        if(accessToken){
            try {
                const decode=jwt.verify(accessToken,jsonAccessKey);
                if(decode){
                    throw createError(404,"user is already loggedIn");
                }
            } catch (error) {
                throw error;
            }
           
        }
       next();
    } catch (error) {
        return next(error);
    }
    
}
const isAdmin=async(req,res,next)=>{
    try {
    
       if(!req.user.isAdmin){
        throw createError(403,"You Must Be a admin.FORBIDDEN");
       }
       next();
    } catch (error) {
        return next(error);
    }
    
}
module.exports={isLogedIn,isLogedOut,isAdmin}