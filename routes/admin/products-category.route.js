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
router.get('/detail/:id',productsCategoryController.detailCategory);
router.get('/edit/:id',productsCategoryController.pageEditCategory);
//[POST]
router.post('/create',upload.single('thumbnail'),uploadCloud.uploadSingle,validationProduct.validation,productsCategoryController.createCategory);


//[PATCH]
router.patch('/change-single-status/:id/:status',productsCategoryController.changeSingleStatus);
router.patch('/change-position/:id/:position',productsCategoryController.changePosition);
router.patch('/remove/:id',productsCategoryController.removeCategory);
router.patch('/edit/:id',upload.single('thumbnail'),uploadCloud.uploadSingle,validationProduct.validation,productsCategoryController.editCategory);
module.exports=router;