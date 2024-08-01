const express=require('express');
const router=express.Router();
const settingController=require('../../controllers/admin/setting,controller');

const multer=require('multer');
const upload=multer();


const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');


router.get('/general', settingController.general);

router.patch('/general',upload.single('logo'),uploadCloud.uploadSingle, settingController.updateGeneral);

module.exports=router;