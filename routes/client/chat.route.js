const express=require('express');
const router=express.Router();
const chatController=require('../../controllers/client/chat.controller');

//middleware
const chatMiddleware = require('../../middleware/client/chat.middleware');
router.get('/:roomChatId',chatMiddleware.isAccessRoomChat,chatController.pageChat);

module.exports=router;