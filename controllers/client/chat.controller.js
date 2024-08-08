const Chat=require('../../models/client/chat.model');
const User=require('../../models/client/user.model');
module.exports.pageChat=async(req,res)=>{
    //Socket io
    const id=res.locals.user.id;
    const fullName=res.locals.user.fullName;

    _io.once('connection', (socket) => {
        //Receive message from client
        socket.on('CLIENT_SEND_MESSAGE', async (message) => {
            const data={
                userId:id,
                content:message,
            }
            const chat=new Chat(data);
            await chat.save();

            _io.emit('SERVER_RETURN_MESSAGE', {
                userId:id,
                content:message,
                fullName:fullName
            });
        })

        //Typing from client
        socket.on('CLIENT_SEND_TYPING',(type)=>{
            socket.broadcast.emit('SERVER_RETURN_TYPING',{
                userId:id,
                fullName:fullName,
                type:type
            })
        })
    })
    

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