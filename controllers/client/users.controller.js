const User=require('../../models/client/user.model');

const userSocket=require('../../sockets/client/users.socket');
module.exports.notFriend = async (req, res) => {
    const idUser=res.locals.user.id;
    userSocket(req,res);
    const requestFriends=res.locals.user.requestFriends;
    const acceptFriends=res.locals.user.acceptFriends;
    const users = await User.find({
        $and:[
            {_id: {$ne: idUser }},
            {_id:{$nin:requestFriends}},
            {_id:{$nin:acceptFriends}},
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