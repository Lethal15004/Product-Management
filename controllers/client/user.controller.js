const User=require('../../models/client/user.model');

const md5=require('md5');

const generateTokenUser=require('../../helpers/generateToken.helper');

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
    req.flash('success','Đăng nhập thành công');
    res.redirect('/');
}