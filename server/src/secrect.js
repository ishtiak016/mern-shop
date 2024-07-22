const { JsonWebTokenError } = require("jsonwebtoken");

require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 5005;
const mongoDbAtlasUrl = "mongodb://localhost:27017/ecommerceMernDb";
const defaultImagePtah='public/images/users/person.jpg'
const jsonActivationKey=process.env.JWT_ACTIVATION_KEY;
const jsonAccessKey=process.env.JWT_ACCESS_KEY;;
const smtpUsername=process.env.SMTP_USERNAME;
const smtpPassword=process.env.SMTP_PASSWORD;
const clientUrl=process.env.CLIENT_URL;

const jsonRefreshKey=process.env.JWT_REFRESH_KEY;
const jsonResetPasswordKey=process.env.JWT_RESET_PASSWORD_KEY;;

module.exports = { serverPort, mongoDbAtlasUrl,defaultImagePtah,jsonActivationKey ,smtpUsername,smtpPassword
    ,clientUrl,jsonAccessKey,jsonResetPasswordKey,jsonRefreshKey};
