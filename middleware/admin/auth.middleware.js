const Account = require('../../models/admin/account.model');
const systemConfig = require('../../config/system');
module.exports = async (req, res, next) => {
    if(req.cookies.token){
        const accountFind= await Account.findOne({token:req.cookies.token,deleted:false});
        if(accountFind){
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