const express=require('express');
const router=express.Router();


const roleController=require('../../controllers/admin/role.controller');
const multer=require('multer');
const upload=multer();

const validationProduct=require('../../validations/admin/product.validation');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');

//[GET]
router.get('/',roleController.index);



module.exports=router;