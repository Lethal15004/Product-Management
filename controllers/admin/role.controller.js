const Role=require('../../models/admin/role.model');
const systemConfig=require('../../config/system');
module.exports.index=async (req,res)=>{
    const roles = await Role.find({deleted:false});
    console.log(roles);
    res.render(`${systemConfig.prefixAdmin}/pages/roles/index`,{
        title:'Nhóm phân quyền',
        roles:roles
    })
}

module.exports.createPage=(req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/roles/role-create`,{
        title:'Thêm mới nhóm phân quyền'
    })
}

module.exports.createRole= async (req,res)=>{
    const newRole= new Role(req.body);
    await newRole.save()
    .then(()=>{
        req.flash('success','Tạo nhóm phân quyền thành công');
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    })
}