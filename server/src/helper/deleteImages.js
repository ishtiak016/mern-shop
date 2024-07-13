const fs = require('fs').promises;

const deleteImage=async(userImagePath)=>{
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log("user image is deleted");
    } catch (error) {
        console.log("user image path does not exits");
    }
  
}
module.exports=deleteImage;