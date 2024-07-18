
const systemConfig=require('../../config/system');
module.exports.index=(req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/profile/index`,{
        title:'Profile',
        account:res.locals.accountUser, // accountUser is set in middlewareAuth
        role:res.locals.roleUser // roleUser is set in middlewareAuth  
    });r
}