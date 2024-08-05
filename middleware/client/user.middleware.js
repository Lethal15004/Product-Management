const User=require('../../models/client/user.model');
module.exports.infoUser=async (req,res,next)=>{
    if(req.cookies.tokenUser){
        const user=await User.findOne({tokenUser:req.cookies.tokenUser,deleted:false});
        if(user){
            res.locals.user=user;
        }else{
            res.clearCookie('tokenUser');
        }
    }
    next();
}

module.exports.requireAuth=async (req,res,next)=>{
    if(!req.cookies.tokenUser){
        req.flash('error','Vui lòng đăng nhập để sử dụng chức năng này');
        res.redirect('/user/login');
        return;
    }
    const user = await User.findOne({tokenUser:req.cookies.tokenUser,deleted:false,status:'active'});
    if(!user){
        req.flash('error','Tài khoản không tồn tại');
        res.redirect('/user/login');
        return;
    }
    next();
}

module.exports.requireEmailVerified=async (req,res,next)=>{
    if(!req.session.tokenUser){
        req.flash('error','Vui lòng nhập email để xác thực tài khoản');
        res.redirect('/user/password/forgot');
        return;
    }
    const user = await User.findOne({tokenUser:req.session.tokenUser,deleted:false,status:'active'});
    if(!user){
        req.flash('error','Tài khoản không tồn tại');
        res.redirect('/user/password/forgot');
        return;
    }
    next();
}