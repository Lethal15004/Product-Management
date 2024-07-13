const Account=require('../../models/admin/account.model');
const Role=require('../../models/admin/role.model');
const md5 = require('md5'); // Thư viện mã hóa password
const systemConfig=require('../../config/system');
const generateTokenHelper=require('../../helpers/generateToken.helper');
module.exports.index=async (req,res)=>{
    const accounts=await Account.find({deleted:false});
    for(const account of accounts){
        const role=await Role.findById(account.role_id);
        account.roleName=role.title;
    }
    res.render(`${systemConfig.prefixAdmin}/pages/accounts/index`,{
        title:'Quản lý tài khoản',
        accounts:accounts
    })
}
module.exports.createPage=async (req,res)=>{
    const roles=await Role.find({deleted:false});
    res.render(`${systemConfig.prefixAdmin}/pages/accounts/account-create`,{
        title:'Thêm tài khoản',
        roles:roles
    })
}

module.exports.createAccount=async (req,res)=>{
    req.body.password=md5(req.body.password);
    req.body.token=generateTokenHelper.generateRandomString(30);
    const  newAccount=new Account(req.body);
    await newAccount.save()
    .then(()=>{
        req.flash('success','Thêm tài khoản thành công');
        res.redirect('/admin/accounts');
    })
}