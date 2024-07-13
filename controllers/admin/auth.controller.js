const Account=require('../../models/admin/account.model');
const md5 = require('md5'); // Thư viện mã hóa password
const systemConfig=require('../../config/system');  
module.exports.loginPage=async (req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/auth/login`,{
        title:'Đăng nhập'
    })
}
module.exports.loginAccount=async (req,res)=>{
    const{email,password}=req.body;
    const account=await Account.findOne({email:email,deleted:false});
    if(!account){
        req.flash('error','Email không tồn tại trong hệ thống');
        res.redirect('back');
        return;
    }
    if(account.password!==md5(password)){
        req.flash('error','Mật khẩu không chính xác');
        res.redirect('back');
        return;
    }
    if(account.status!=='active'){
        req.flash('error','Tài khoản của bạn đã bị khóa');
        res.redirect('back');
        return;
    }
    res.cookie('token',account.token,{httpOnly: true});
    res.redirect('/admin/dashboard');
}
