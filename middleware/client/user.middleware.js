const User=require('../../models/client/user.model');
module.exports=async (req,res,next)=>{
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