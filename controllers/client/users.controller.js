const User=require('../../models/client/user.model');
module.exports.notFriend = async (req, res) => {
    const idUser=res.locals.user.id;
    const users = await User.find({
        _id: { $ne: idUser },
        status: 'active',
        deleted:false,
    }).select('fullName email');
    res.render('client/pages/users/not-friend', {
        title:'Danh sách người dùng',
        users: users,
    })
}