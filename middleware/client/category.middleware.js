const Category=require('../../models/admin/product-category.model');
const createTreeHelper=require('../../helpers/createTreRecursion.helper');
module.exports= async (req,res,next)=>{
    const categories=await Category.find({deleted:false,status:'active'});
    const newCategories=createTreeHelper(categories);
    res.locals.categories=newCategories;
    next();
}