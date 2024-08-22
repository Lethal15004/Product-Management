const RoomChat=require('../../models/client/rooms-chat.model');
module.exports.isAccessRoomChat = async(req,res,next)=>{
    try{
        const idCurrent=res.locals.user.id;
        const roomChat=await RoomChat.findOne({
            _id:req.params.roomChatId,
            deleted:false,
            'users.userId':idCurrent
        })
        if(!roomChat){
            req.flash('error','Bạn không có quyền truy cập');
            res.redirect('/users/friends');
            return;
        }
        next();
    }catch(error){
        req.flash('error','Lỗi server');
        res.redirect('/users/friends');
    }
    
}