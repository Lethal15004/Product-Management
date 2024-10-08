const User=require('../../models/client/user.model');
const RoomChat=require('../../models/client/rooms-chat.model');
//helpers
module.exports=(req,res)=>{
    const userIdA=res.locals.user.id;
    const fullName=res.locals.user.fullName;
    _io.once('connection', (socket) => {
         // Khi A gửi yêu cầu cho B
        socket.on('CLIENT_ADD_FRIEND',async (userIdB)=>{
             // Thêm id của B vào requestFriends của A
            const userBInA=await User.findOne({
                _id:userIdA,
                requestFriends:userIdB,
            })
            if(!userBInA){
                await User.updateOne({
                    _id:userIdA,
                },{
                    $push:{
                        requestFriends:userIdB,
                    }
                })
            }
            // Thêm id của A vào acceptFriends của B
            const userAInB=await User.findOne({
                _id:userIdB,
                acceptFriends:userIdA,
            })
            if(!userAInB){
                await User.updateOne({
                    _id:userIdB,
                },{
                    $push:{
                        acceptFriends:userIdA,
                    }
                })
            }

            // Trả về cho trang Lời mời đã nhận của B độ dài của acceptFriends
            const userB=await User.findOne({
                _id:userIdB,
                status: 'active',
                deleted:false,
            }).select('acceptFriends');
            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND',userB)

             // Lấy thông tin của A để vẽ ở trang Lời mời đã nhận của B
            const infoA=await User.findOne({
                _id:userIdA,
                status: 'active',
                deleted:false,
            }).select("fullName avatar")
            socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIEND',{
                userIdB:userIdB,
                infoA:infoA
            })

            //Xóa user A ở trang Danh sách người dùng của B
            socket.broadcast.emit('SERVER_RETURN_ID_ACCEPT_FRIEND',{
                userIdB:userIdB,
                userIdA:userIdA,
            })
        })
        // End Khi A gửi yêu cầu cho B

        // Chức năng A hủy gửi yêu cầu
        socket.on('CLIENT_CANCEL_ADD_FRIEND',async (userIdB)=>{

            // Xóa id của B trong requestFriends của A
            const userBInA=await User.findOne({
                _id:userIdA,
                requestFriends:userIdB,
            })
            if(userBInA){
                await User.updateOne({
                    _id:userIdA,
                },{
                    $pull:{
                        requestFriends:userIdB,
                    }
                })
            }

            // Xóa id của A trong acceptFriends của B
            const userAInB=await User.findOne({
                _id:userIdB,
                acceptFriends:userIdA,
            })
            if(userAInB){
                await User.updateOne({
                    _id:userIdB,
                },{
                    $pull:{
                        acceptFriends:userIdA,
                    }
                })
            }

            // Trả về cho B độ dài của acceptFriends
            const userB=await User.findOne({
                _id:userIdB,
                status: 'active',
                deleted:false,
            }).select('acceptFriends');
            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND',userB)

            // Trả về cho B id của A
            socket.broadcast.emit('SERVER_RETURN_ID_CANCEL_FRIEND',{
                userIdB:userIdB,
                userIdA:userIdA,
            })
        })
         // Hết Chức năng hủy gửi yêu cầu


         // Chức năng từ chối kết bạn
        socket.on('CLIENT_REFUSE_FRIEND',async (userIdB)=>{
            // Xóa id của A trong acceptFriends của B
            const userBInA=await User.findOne({
                _id:userIdA,
                acceptFriends:userIdB,
            })
            if(userBInA){
                await User.updateOne({
                    _id:userIdA,
                },{
                    $pull:{
                        acceptFriends:userIdB,
                    }
                })
            }

            // Xóa id của B trong requestFriends của A
            const userAInB=await User.findOne({
                _id:userIdB,
                requestFriends:userIdA,
            })
            if(userAInB){
                await User.updateOne({
                    _id:userIdB,
                },{
                    $pull:{
                        requestFriends:userIdA,
                    }
                })
            }
        })
        // Hết Chức năng từ chối kết bạn
        
        // Chức năng chấp nhận kết bạn
        socket.on('CLIENT_ACCEPT_FRIEND',async (userIdB)=>{

            //Tạo phòng chat giữa 2 người
            const newRoomChat= new RoomChat({
                typeRoom:'friend',
                users:[
                    {
                        userId:userIdA,
                        role:'superAdmin'
                    },{
                        userId:userIdB,
                        role:'superAdmin'
                    }
                ]
            })
            await newRoomChat.save();

            const userBInA=await User.findOne({
                _id:userIdA,
                acceptFriends:userIdB,
            })
            if(userBInA){
                await User.updateOne({
                    _id:userIdA,
                },{
                    $push:{
                        listFriends:{
                            userId:userIdB,
                            roomChatId:newRoomChat.id
                        }
                    },
                    $pull:{
                        acceptFriends:userIdB,
                    }
                })
            }
            const userAInB=await User.findOne({
                _id:userIdB,
                requestFriends:userIdA,
            })
            if(userAInB){
                await User.updateOne({
                    _id:userIdB
                },{
                    $push:{
                        listFriends:{
                            userId:userIdA,
                            roomChatId:newRoomChat.id
                        }
                    },
                    $pull:{
                        requestFriends:userIdA,
                    }
                })
            }
        })
        // Hết Chức năng chấp nhận kết bạn
    })
}