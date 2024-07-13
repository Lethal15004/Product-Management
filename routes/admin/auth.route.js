const express=require('express');
const router=express.Router();

const multer=require('multer');
const upload=multer();
const authController=require('../../controllers/admin/auth.controller');
const uploadCloud=require('../../middleware/admin/uploadCloudinary.middleware');

router.get('/login',authController.loginPage);

router.post('/login',authController.loginAccount);

module.exports=router;