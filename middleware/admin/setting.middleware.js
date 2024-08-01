const Setting=require('../../models/admin/setting.model');
module.exports= async(req,res,next)=>{
    const setting=await Setting.findOne({});
    if(setting){
        res.locals.setting=setting;
    }
    next();
}