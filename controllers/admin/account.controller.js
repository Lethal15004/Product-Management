const Account=require('../../models/admin/account.model');
const Role=require('../../models/admin/role.model');
const md5 = require('md5'); // Thư viện mã hóa password
const systemConfig=require('../../config/system');
const generateTokenHelper=require('../../helpers/generateToken.helper');


module.exports.index=async (req,res)=>{
    const accounts=await Account.find({deleted:false});
    for(const account of accounts){
        const role=await Role.findById(account.role_id).select('title');
        account.roleName=role.title;
    }
    res.render(`${systemConfig.prefixAdmin}/pages/accounts/index`,{
        title:'Quản lý tài khoản',
        accounts:accounts
    })
}
module.exports.createPage=async (req,res)=>{
    const roles=await Role.find({deleted:false}).select('title');
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
module.exports.removeAccount=async (req,res)=>{
    try {
        const id =req.params.id;
        await Account.updateOne({_id:id},{deleted:true});
        res.json({
            code:200,
            message:"Xóa tài khoản thành công"
        })
    } catch (error) {
        res.json({
            code:500,
            message:"Xóa tài khoản thất bại"
        })
    }
}
module.exports.editPage= async (req,res)=>{
    try {
        const id =req.params.id;
        const account=await Account.findOne({
            _id: id,
            deleted: false
        });
        const roles=await Role.find({deleted:false}).select('title');
        res.render(`${systemConfig.prefixAdmin}/pages/accounts/account-edit`,{
            title:'Chỉnh sửa tài khoản',
            roles: roles,
            account: account
        })
    } catch (error) {
        req.flash('error','Tài khoản không tồn tại');
        res.redirect('/admin/accounts');
    }
    
}
module.exports.editAccount=async (req,res)=>{
    try {
        const id=req.params.id;
        if(req.body.password===''){
            delete req.body.password;
        }else{
            req.body.password=md5(req.body.password);
        }
        await Account.updateOne({_id:id},req.body);
        req.flash('success','Chỉnh sửa tài khoản thành công');
        res.redirect('back');
    } catch (error) {
        req.flash('error','Chỉnh sửa tài khoản thất bại');
        res.redirect('back');
    }
}

module.exports.changeSingleStatus=async (req,res)=>{
    try {
        const{status,id}=req.params;
        await Account.updateOne({_id:id},{status:status});
        res.json({
            code:200,
            message:"Thay đổi trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code:500,
            message:"Thay đổi trạng thái thất bại"
        })
    }
    
}