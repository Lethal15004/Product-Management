const User=require('../../models/client/user.model');

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

            // Trả về cho B độ dài của acceptFriends
            const userB=await User.findOne({
                _id:userIdB,
                status: 'active',
                deleted:false,
            }).select('acceptFriends');
            socket.broadcast.emit('SERVER_RETURN_LENGTH_ACCEPT_FRIEND',userB)

             // Lấy thông của A để trả về cho B
            const infoA=await User.findOne({
                _id:userIdA,
                status: 'active',
                deleted:false,
            }).select("fullName avatar")
            socket.broadcast.emit('SERVER_RETURN_INFO_ACCEPT_FRIEND',{
                userIdB:userIdB,
                infoA:infoA
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
                            roomChatId:''
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
                            roomChatId:''
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