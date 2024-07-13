const mongoose = require("mongoose");
const { mongoDbAtlasUrl } = require("../secrect");

const connectDb = async (options = {}) => {
    try {
        if (!mongoDbAtlasUrl) {
            throw new Error('MONGODB_ATLAS_URL is not set in environment variables.');
        }
        await mongoose.connect(mongoDbAtlasUrl, options);
        console.log("mongodb connection successfully");
        mongoose.connection.on('error', (error) => {
            console.error("DB connection error", error);
        });
    } catch (error) {
        console.log("could not connect to DB", error);
    }
};

module.exports = connectDb;

