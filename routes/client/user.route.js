const express=require('express');
const router=express.Router();
const userController=require('../../controllers/client/user.controller');

router.get('/register',userController.pageRegister);
router.post('/register',userController.register);

router.get('/login',userController.pageLogin);
router.post('/login',userController.login);

router.get('/logout',userController.logout);
module.exports=router;