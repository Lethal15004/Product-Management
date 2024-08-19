const express=require('express');
const router=express.Router();

const userController=require('../../controllers/client/users.controller');

router.get('/not-friend',userController.notFriend);
router.get('/request',userController.request);
router.get('/accept',userController.accept);
router.get('/friends',userController.friends);
module.exports=router;