const express=require('express');
const router=express.Router();
const userController=require('../../controllers/client/user.controller');


//middleware
const userMiddleware=require('../../middleware/client/user.middleware');
router.get('/register',userController.pageRegister);
router.post('/register',userController.register);

router.get('/login',userController.pageLogin);
router.post('/login',userController.login);

router.get('/logout',userController.logout);

router.get('/password/forgot',userController.pageForgotPassword);
router.post('/password/forgot',userController.forgotPassword);

router.get('/password/otp',userMiddleware.requireEmailVerified,userController.pageOtp);
router.post('/password/otp',userMiddleware.requireEmailVerified,userController.otp);

router.get('/password/reset',userMiddleware.requireEmailVerified,userController.pageResetPassword);
router.patch('/password/reset',userMiddleware.requireEmailVerified,userController.resetPassword);

router.get('/profile',userMiddleware.requireAuth,userController.pageProfile);
module.exports=router;