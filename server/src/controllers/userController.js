const createError = require("http-errors");
const user = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const deleteImage = require("../helper/deleteImages");
const createJsonWebToken = require("../helper/jsonWebToken");
const { jsonActivationKey, clientUrl } = require("../secrect");
const { sendMailWithNodeMailer } = require("../helper/email");
const jwt= require("jsonwebtoken");
const {handleUserAction,findUsers} = require("../services/userServices");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const {users,pagination}= await findUsers(search,page,limit);
    return successResponse(res, {
      statusCode: 200,
      message: "User data return Successfully",
      payload: {
        users,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
   
    const id = req.params.id;

    const options = { password: 0 };
    const users = await findWithId(user, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User data return Successfully",
      payload: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const options = { password: 0 };
    const users = await findWithId(user, id, options);

    const userImagePath = users.image;
    deleteImage(userImagePath);
    await user.findByIdAndDelete({ _id: id, isAdmin: false });
    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted  Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {

    const { name, email, password, phone, address } = req.body;
    const image = req.file;
    if(!image){
      throw createError(
        400,
        "image required"
      );
    };
    if(image.size>1024*1024*2){
      throw createError(
        400,
        "image is too large then 2MB"
      );
    };
    const imageBufferString=image.buffer.toString('base64');

    if (!jsonActivationKey) {
      throw createError(
        500,
        "Internal Server Error: jsonActivationKey is not defined."
      );
    }

    const token = createJsonWebToken(
      { name, email, password, phone, address ,
        image: imageBufferString},
      jsonActivationKey,
      "10m"
    );
 
    const emailData=
    {
      email,
      subject:'account activation mail',
      html :`
      <h2>hello ${name} !</h2>
      <p>please click here <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `
    }
    try {
      await sendMailWithNodeMailer(emailData);;
    } catch (error) {
      next(createError(500,"Failed to sending verification mail"));
      return ;
    }
    
  //  const newUser = { name, email, password, phone, address };
    const exitsUser = await user.exists({ email: email });
    if (exitsUser) {
      throw createError(409, "this email is already use. please sign in");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "please go to your email for registration successfully odne ",
      payload: { token,imageBufferString },
    });
  } catch (error) {
  
    next(error);
  }
};


const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;

    if(!token) throw createError(404,"token not found");
    const decode=jwt.verify(token,jsonActivationKey);
    if(!decode) throw createError(401,"user not verified");
    const exitsUser = await user.exists({ email: decode.email });
    if (exitsUser) {
      throw createError(409, "this email is already use. please sign in");
    }
    await user.create(decode);
    return successResponse(res, {
      statusCode: 200,
      message: "User was register Successfully",

    });
  } catch (error) {
    next(error);
  }
};


const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    const users = await findWithId(user, userId, options);
    const updateOptions = { new :true, validators:true,Context:'query' };
    let updates={};


    const image=req.file;
    if(image){
      //image size is 2mb
      if(image.size>1024*1024*2){
        throw createError(
          400,
          "image is too large then 2MB"
        );
      }
      updates.image=image.buffer.toString('base64');

    };
    for(let key in req.body){
      if(['name','password','phone','address'].includes(key)){
        updates[key]=req.body[key];
      }
    }

    for(let key in req.body){
      if(['email'].includes(key)){
        throw createError(400,"Email can not be updated by user");
      }
    }
    const updatedUser=await user.findByIdAndUpdate(userId,updates,updateOptions).select("-password");
    if(!updatedUser){
      throw createError(400,"User Id does not exits");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was updated  Successfully",
      payload:{updatedUser}
    });
  } catch (error) {
    next(error);
  }
};

const handleManageUserById = async (req, res, next) => {
  try {

     const userId = req.params.id;
     const action=req.body.action;
     const successMessage= await handleUserAction(userId,action);

    return successResponse(res, {
      statusCode: 200,
      message: successMessage,
      payload:{}
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { getUsers, getUserById, deleteUserById, processRegister ,activateUserAccount,updateUserById,handleManageUserById};
