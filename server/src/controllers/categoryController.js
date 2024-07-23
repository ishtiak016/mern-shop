const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Category = require("../models/categoryModel");
const slugify = require('slugify');
const addCategory=async(req,res,next)=>{

    try {
        const {name}=req.body;
        console.log(slugify(name));
        const newCategory=await Category.create({
            name: name,
            slug: slugify(name)
        });
        if(!newCategory){
            throw createError(404,"category is not create");
        }
    
        return successResponse(res, {
            statusCode: 200,
            message: "category is  created Successfully",
            payload:{
                newCategory
            }
          });
    } catch (error) {
        next(error);
    }
  

}
const getAllCategories =async(req,res,next)=>{
    try {
        const search = req.query.search || "";
 
        const searchRegExpresion = new RegExp(".*" + search + ".*", "i");
        const filtre = {
          isAdmin: { $ne: true },
          $or: [
            { name: { $regex: searchRegExpresion } },
            { slug: { $regex: searchRegExpresion } },
          ],
        };
   
        const categories = await Category
          .find(filtre)
          

        if (!categories) throw createError(404, "no categories found");
    
        return successResponse(res, {
            statusCode: 200,
            message: "categories data return Successfully",
            payload: {
                categories,
            },
          });
    } catch (error) {
        if(error instanceof mongoose.Error){
            throw createError(400,"Invalid item Id");
            
          }
        throw (error);
    }
}

module.exports={addCategory,getAllCategories};
