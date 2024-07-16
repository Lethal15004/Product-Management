const Account = require('../../models/admin/account.model');
const Role=require('../../models/admin/role.model');
const systemConfig = require('../../config/system');
module.exports = async (req, res, next) => {
    if(req.cookies.token){
        const accountFind= await Account.findOne({token:req.cookies.token,deleted:false}).select('fullName email phone avatar role_id');
    
        if(accountFind){
            const role=await Role.findOne({_id:accountFind.role_id,deleted:false}).select('title permissions');
            res.locals.accountUser=accountFind;
            res.locals.roleUser=role;
            next();
        }
        else{
            req.flash('error', 'You must login to access this page');
            res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
            return;
        }
    }else{
        req.flash('error', 'You must login to access this page');
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }
    
}