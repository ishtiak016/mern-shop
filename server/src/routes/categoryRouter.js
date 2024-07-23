const express =require("express");
const { isLogedIn, isAdmin } = require("../middleware/auth");
const { addCategory, getAllCategories } = require("../controllers/categoryController");
const { validedCategory } = require("../validators/auth");
const { runValidation } = require("../validators");
const categoryRouter=express.Router();
categoryRouter.post("/add-category",isLogedIn,isAdmin,validedCategory,runValidation, addCategory);

categoryRouter.get('/all-categories',isLogedIn,isAdmin,getAllCategories);
module.exports=categoryRouter;