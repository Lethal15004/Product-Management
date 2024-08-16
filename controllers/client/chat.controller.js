const Chat=require('../../models/client/chat.model');
const User=require('../../models/client/user.model');

//helpers
const streamUpload=require('../../helpers/streamUpload.helper');

//socket io
const chatSocket=require('../../sockets/client/chat.socket');

module.exports.pageChat=async(req,res)=>{
    chatSocket(req,res);
    const chats=await Chat.find({});
    for(const chat of chats){
        const user=await User.findOne({_id:chat.userId}).select('fullName');
        chat.fullName=user.fullName;
    }
    //End socket io
    res.render('client/pages/chat/index.pug',{
        title:'Chat',
        chats:chats
    })
}