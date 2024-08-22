const User=require('../../models/client/user.model');
const RoomChat=require('../../models/client/rooms-chat.model');  
module.exports.index=async(req,res)=>{
    res.render('client/pages/rooms-chat/index.pug',{
        title: "Danh sách phòng"
    })
}

module.exports.createPage=async(req,res)=>{
    const listFriends =res.locals.user.listFriends;
    for(const friend of listFriends){
        const infoFriend=await User.findOne({
            _id:friend.userId,
            status:"active",
            deleted:false
        }).select('fullName avatar');
        friend.fullName=infoFriend.fullName
    }
    res.render('client/pages/rooms-chat/create.pug',{
        title: "Tạo phòng",
        listFriends:listFriends
    })
}

module.exports.create=async(req,res)=>{
    const title=req.body.title
    const usersId=req.body.usersId

    const dataSave={
        title:title,
        typeRoom:'group',
        users:[]
    }

    //Thêm người tạo phòng vào danh sách user
    dataSave.users.push({
        userId:res.locals.user.id,
        role:'superAdmin'
    })

    //Thêm thành viên vào phòng
    for(const id of usersId){
        const newUser={
            userId:id,
            role:'user'
        }
        dataSave.users.push(newUser);
    }

    const newRoom = new RoomChat(dataSave);
    newRoom.save();

    req.flash('success','Tạo phòng thành công');
    res.redirect(`/chat/${newRoom.id}`);
}