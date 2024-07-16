const express=require('express');
const router=express.Router();

const multer=require('multer');
const upload=multer();

const accountController=require('../../controllers/admin/account.controller');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');


router.get('/',accountController.index);
router.get('/create',accountController.createPage);
router.get('/edit/:id',accountController.editPage);
router.get('/detail/:id',accountController.detailPage);

router.patch('/remove/:id',accountController.removeAccount);
router.patch('/edit/:id',upload.single('avatar'),uploadCloud.uploadSingle,accountController.editAccount);
router.patch('/changeSingleStatus/:status/:id',accountController.changeSingleStatus);

router.post('/create',upload.single('avatar'),uploadCloud.uploadSingle,accountController.createAccount);

module.exports=router;