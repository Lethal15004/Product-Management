const User=require('../../models/client/user.model');

const userSocket=require('../../sockets/client/users.socket');

module.exports.notFriend = async (req, res) => {
    const idUser=res.locals.user.id;
    userSocket(req,res);
    const requestFriends=res.locals.user.requestFriends;
    const acceptFriends=res.locals.user.acceptFriends;
    const listFriends=res.locals.user.listFriends;
    const newListFriends=listFriends.map(friend=>friend.userId);
    const users = await User.find({
        $and:[
            {_id: {$ne: idUser }},
            {_id:{$nin:requestFriends}},
            {_id:{$nin:acceptFriends}},
            {_id:{$nin:newListFriends}},
        ],
        status: 'active',
        deleted:false,
    }).select('fullName email');
    res.render('client/pages/users/not-friend', {
        title:'Danh sách người dùng',
        users: users,
    })
}

module.exports.request = async (req, res) => {
    const idUser=res.locals.user.id;
    userSocket(req,res);
    const requestFriends=res.locals.user.requestFriends;

    const users = await User.find({
        _id:{$in:requestFriends},
        status: 'active',
        deleted:false,
    }).select('fullName email');
    res.render('client/pages/users/request', {
        title:'Lời mời đã gửi',
        users: users,
    })
}

module.exports.accept = async (req, res) => {
    const idUser=res.locals.user.id;
    userSocket(req,res);
    const acceptFriends=res.locals.user.acceptFriends;

    const users = await User.find({
        _id:{$in:acceptFriends},
        status: 'active',
        deleted:false,
    }).select('fullName email');
    res.render('client/pages/users/accept', {
        title:'Lời mời đã nhận',
        users: users,
    })
}

module.exports.friends = async (req, res) => {
    const idUser=res.locals.user.id;
    userSocket(req,res);
    const listFriends=res.locals.user.listFriends;
    const newListFriends=listFriends.map(friend=>friend.userId);
    const users = await User.find({
        _id:{$in:newListFriends},
        status: 'active',
        deleted:false,
    }).select('fullName email statusOnline');

    for (const user of users){
        const roomChatId= listFriends.find(friend=>friend.userId==user.id).roomChatId;
        user.roomChatId=roomChatId;
    }

    res.render('client/pages/users/friends', {
        title:'Danh sách bạn bè',
        users: users,
    })
}