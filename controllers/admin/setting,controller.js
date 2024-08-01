const Setting=require('../../models/admin/setting.model');


module.exports.general=async(req,res)=>{
    res.render('admin/pages/setting/general',{
        title:"Cài đặt chung",
    })
}

module.exports.updateGeneral=async(req,res)=>{
    const setting=res.locals.setting;
    if(setting){
        await Setting.updateOne({_id:setting.id},req.body);
    }else{
        const setting= new Setting(req.body);
        await setting.save();
    }
    req.flash('success','Cập nhật cài đặt thành công');
    res.redirect('back');
}