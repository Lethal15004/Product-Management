const Chat=require('../../models/client/chat.model');

//helpers
const streamUpload=require('../../helpers/streamUpload.helper');

module.exports=(req,res)=>{
    const id=res.locals.user.id;
    const fullName=res.locals.user.fullName;
    const roomChatId=req.params.roomChatId;
    _io.once('connection', (socket) => {

        //Đưa user vào room chat của user đó
        socket.join(roomChatId);

        //Receive message from client
        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            const dataSave={
                userId:id,
                content:data.message,
                roomChatId:roomChatId
            }

            const linkImages=[];
            for(const image of data.images){
                const link=await streamUpload(image);
                linkImages.push(link.url);
            }
            dataSave.images=linkImages;

            const chat=new Chat(dataSave);
            await chat.save();

            _io.to(roomChatId).emit('SERVER_RETURN_MESSAGE', {
                userId:id,
                content:data.message,
                fullName:fullName,
                images:linkImages
            });

        })

        //Typing from client
        socket.on('CLIENT_SEND_TYPING',(type)=>{
            socket.broadcast.to(roomChatId).emit('SERVER_RETURN_TYPING',{
                userId:id,
                fullName:fullName,
                type:type
            })
        })
    })
}