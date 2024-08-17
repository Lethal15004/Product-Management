const User=require('../../models/client/user.model');

//helpers
module.exports=(req,res)=>{
    const userIdA=res.locals.user.id;
    
    _io.once('connection', (socket) => {
        socket.on('CLIENT_ADD_FRIEND',async (userIdB)=>{
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
        })

        socket.on('CLIENT_CANCEL_ADD_FRIEND',async (userIdB)=>{
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
        })
    })
}