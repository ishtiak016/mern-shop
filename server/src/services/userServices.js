const createError = require("http-errors");
const user = require("../models/userModel");
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
        throw (error);
    }
}
module.exports={handleUserAction,findUsers};