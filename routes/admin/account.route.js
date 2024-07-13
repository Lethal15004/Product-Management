const express=require('express');
const router=express.Router();

const multer=require('multer');
const upload=multer();

const accountController=require('../../controllers/admin/account.controller');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');


router.get('/',accountController.index);
router.get('/create',accountController.createPage);
router.post('/create',upload.single('avatar'),uploadCloud.uploadSingle,accountController.createAccount);

module.exports=router;