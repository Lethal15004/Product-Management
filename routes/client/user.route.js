const express=require('express');
const router=express.Router();
const userController=require('../../controllers/client/user.controller');
router.get('/register',userController.index);
router.post('/register',userController.register);
module.exports=router;