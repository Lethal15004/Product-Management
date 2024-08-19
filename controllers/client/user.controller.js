const User=require('../../models/client/user.model');
const ForgotPassword=require('../../models/client/forgot-password.model');
const md5=require('md5');

const generateTokenUser=require('../../helpers/generateToken.helper');
const sendEmailHelper=require('../../helpers/sendEmail.helper');
module.exports.pageRegister= async (req,res)=>{
    res.render('client/pages/user/register',{
        title: 'Đăng ký'
    })
}

module.exports.register= async (req,res)=>{
    const userExist=await User.findOne({email:req.body.email});
    if(userExist){
       req.flash('error','Email đã tồn tại');
       res.redirect('back');
       return;
    }
    const userData={
        fullName:req.body.fullName,
        email:req.body.email,
        password:md5(req.body.password),
        tokenUser:generateTokenUser.generateRandomString(30),
    }
    const newUser=new User(userData);
    newUser.save();
    res.cookie('tokenUser',newUser.tokenUser);
    req.flash('success','Đăng ký thành công');
    res.redirect('/');
}


module.exports.pageLogin= async (req,res)=>{
    res.render('client/pages/user/login',{
        title: 'Đăng nhập'
    })
}

module.exports.login= async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({
        email:email,
        status:'active',
        deleted:false
    })
    if(!user){
        req.flash('error','Email không tồn tại');
        res.redirect('back');
        return;
    }  
    if(md5(password)!==user.password){
        req.flash('error','Mật khẩu không đúng');
        res.redirect('back');
        return;
    }
    if(user.status!=='active'){
        req.flash('error','Tài khoản đang bị khóa');
        res.redirect('back');
        return;
    }
    res.cookie('tokenUser',user.tokenUser);
    await User.updateOne({
        email:email,
        status:'active',
        deleted:false
    },{
        statusOnline:'online'
    })
    //Trả lại cho bạn bè trạng thái online của A
    _io.once('connection',(socket)=>{
        socket.broadcast.emit('SERVER_RETURN_USER_ONLINE',{
            statusOnline:'online',
            id:user._id
        })
    })
    req.flash('success','Đăng nhập thành công');
    res.redirect('/');
}

module.exports.logout= async (req,res)=>{
    try {
        await User.updateOne({
            tokenUser:req.cookies.tokenUser,
            status:'active',
            deleted:false
         },{
              statusOnline:'offline'
         })
    } catch (error) {
        req.flash('error','Lỗi chưa đăng nhập');
        res.redirect('/user/login');
        return;
    }

    //Trả lại cho bạn bè trạng thái offline của A
    _io.once('connection',(socket)=>{
        socket.broadcast.emit('SERVER_RETURN_USER_ONLINE',{
            statusOnline:'offline',
            id:res.locals.user.id
        })
    })
    res.clearCookie('tokenUser');
    req.flash('success','Đăng xuất thành công');
    res.redirect('/user/login');
}

module.exports.pageForgotPassword= async (req,res)=>{
    res.render('client/pages/user/forgot-password',{
        title: 'Lấy lại mật khẩu'
    })
}

module.exports.forgotPassword= async (req,res)=>{
    const email=req.body.email;
    const user=await User.findOne({email:email,status:'active',deleted:false});
    if(!user){
        req.flash('error','Email không tồn tại');
        res.redirect('back');
        return;
    }
    const otp=generateTokenUser.generateRandomNumber(6);
    const dataSave={
        email:email,
        otp:otp,
        expireAt: Date.now() + 3*60*1000
    }
    
    const newForgotPassword=new ForgotPassword(dataSave);
    newForgotPassword.save();
    
    const subject= 'Mã OTP lấy lại mật khẩu';
    const html = `Mã OTP xác thực của bạn là <b style="color: greenyellow;">${otp}</b>. Mã OTP có hiệu lực trong 3 phút. Vui lòng không cung cấp mã OTP cho người khác`;
    sendEmailHelper.sendEmail(email,subject,html);
    req.session.tokenUser = user.tokenUser;
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.pageOtp= async (req,res)=>{
    res.render('client/pages/user/otp-password',{
        title:'Xác nhận OTP',
        email:req.query.email
    })
}

module.exports.otp= async (req,res)=>{
    const {email,otp}=req.body;
    const forgotPassword=await ForgotPassword.findOne({email:email,otp:otp});
    if(!forgotPassword){
        req.flash('error','Mã OTP không đúng');
        res.redirect('back');
        return;
    }
    const user=await User.findOne({
        email:email,
        status:'active',
        deleted:false
    })

    res.redirect('/user/password/reset');
}

module.exports.pageResetPassword= async (req,res)=>{
    res.render('client/pages/user/reset-password',{
        title:'Đổi mật khẩu mới',
    })
}
module.exports.resetPassword= async (req,res)=>{
    const newPassword=md5(req.body.password);
    await User.updateOne({tokenUser:req.session.tokenUser},{password:newPassword});
    req.flash('success','Đổi mật khẩu thành công');
    res.redirect('/user/login');
}

module.exports.pageProfile= async (req,res)=>{
    const user=await User.findOne({tokenUser:req.cookies.tokenUser});
    res.render('client/pages/user/profile',{
        title:'Thông tin tài khoản ca nhân',
        user:user
    })
}