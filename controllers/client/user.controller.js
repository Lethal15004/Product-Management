const User=require('../../models/client/user.model');

const md5=require('md5');

const generateTokenUser=require('../../helpers/generateToken.helper');
module.exports.index= async (req,res)=>{
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