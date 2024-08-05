const express=require('express');
const router=express.Router();
const chatController=require('../../controllers/client/chat.controller');

router.get('/',chatController.pageChat);

module.exports=router;