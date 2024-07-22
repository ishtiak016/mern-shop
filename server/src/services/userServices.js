const createError = require("http-errors");
const user = require("../models/userModel");
const { findWithId } = require("./findItem");
const deleteImage = require("../helper/deleteImages");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const findUsers=async (search,page,limit)=>{
    try {
        const searchRegExpresion = new RegExp(".*" + search + ".*", "i");
        const filtre = {
          isAdmin: { $ne: true },
          $or: [
            { name: { $regex: searchRegExpresion } },
            { email: { $regex: searchRegExpresion } },
            { phone: { $regex: searchRegExpresion } },
          ],
        };
        const options = { password: 0 };
        const users = await user
          .find(filtre, options)
          .limit(limit)
          .skip((page - 1) * limit);
        const count = await user.find(filtre).countDocuments();
        if (!users) throw createError(404, "no user found");
    
        return {users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
              },
        };
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
        throw (error);
    }

}
const handleUserAction=async(userId,action,)=>{
    try {
        let updates;
        let successMessage;
        if(action=='ban'){
         updates={isBanned:true};
         successMessage="User was not banned successfully";
        }else if(action=='unban'){
         updates={isBanned:false};
         successMessage="User was not unbanned successfully";
        }else{
         throw createError(400,"Invalid action use Ban or unban");
        }
        const updateOptions = { new :true, validators:true,Context:'query' };
        const updatedUser=await user.findByIdAndUpdate(userId,updates,updateOptions).select("-password");
        if(!updatedUser){
          throw createError(400,"User was not banned successfully");
        }
        return successMessage;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
        throw (error);
    }
}
const handlegetUserById=async(id,oprion)=>{
    try {
        const options = { password: 0 };
        const users = await findWithId(user, id, options);
        if(!users){
            throw createError(404,"user not found");
        }
        return users;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
       throw (error); 
    }
}
const handleDeleteUserById=async(id,options)=>{
    try {
        const users = await findWithId(user, id, options);

        const userImagePath = users.image;
        deleteImage(userImagePath);
        const deleteUser=await user.findByIdAndDelete({ _id: id, isAdmin: false });
        let successMessage;
        if(deleteUser){
            successMessage ="delete Successfully";
        }else{
            successMessage ="delete is not  Successfully";
        }
        return successMessage;
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
       throw (error); 
    }
}

const handlePasswordUpdate=async(userId,oldPassword,newPassword,options)=>{
    try {
    const users =await findWithId(user, userId, options);

    const isPasswordMatch=await bcrypt.compare(oldPassword,users.password);
    if(!isPasswordMatch){
            throw createError(400,"Email and password is not match");
      }

    const updates={$set:{password: newPassword}};
    const updateOptions={new :true}
    const updatedUser =await user.findByIdAndUpdate(userId,updates,updateOptions).select("-password");
    let successMessage;
    if(!updatedUser){
        successMessage="password change was not  successfully";
    }
    successMessage="password change  successfully";
    return {successMessage,updatedUser};
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
       throw (error); 
    }
}
module.exports={handleUserAction,findUsers,handlegetUserById,handleDeleteUserById,handlePasswordUpdate};