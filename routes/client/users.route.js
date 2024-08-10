const express=require('express');
const router=express.Router();

const userController=require('../../controllers/client/users.controller');

router.get('/not-friend',userController.notFriend);

module.exports=router;