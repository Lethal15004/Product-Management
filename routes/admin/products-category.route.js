const express=require('express');
const router=express.Router();
const productsCategoryController=require('../../controllers/admin/products-category.controller');

const multer=require('multer');
const upload=multer();

const validationProduct=require('../../validations/admin/product.validation');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');


//[GET]
router.get('/',productsCategoryController.index);
router.get('/create',productsCategoryController.createPage);

//[POST]
router.post('/create',upload.single('thumbnail'),uploadCloud.uploadSingle,validationProduct.validation,productsCategoryController.createCategory);

module.exports=router;