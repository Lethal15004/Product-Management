const express=require('express');
const router=express.Router();


const roleController=require('../../controllers/admin/role.controller');
const multer=require('multer');
const upload=multer();

const validationProduct=require('../../validations/admin/product.validation');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');

//[GET]
router.get('/',roleController.index);
router.get('/create',roleController.createPage);
router.get('/edit/:id',roleController.editPage);
router.get('/detail/:id',roleController.detailPage);

router.get('/permissions',roleController.permissionsPage);

//[POST]
router.post('/create',validationProduct.validation,roleController.createRole);

//[PATCH]
router.patch('/edit/:id',validationProduct.validation,roleController.editRole);
router.patch('/remove/:id',roleController.removeRole);
router.patch('/permissions',roleController.updatePermissions);

module.exports=router;