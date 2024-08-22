const express=require('express');
const router=express.Router();

//controller
const roomsChatController=require('../../controllers/client/rooms-chat.controller');

router.get('/',roomsChatController.index);

module.exports=router;