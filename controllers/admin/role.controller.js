const Role=require('../../models/admin/role.model');

module.exports.index=(req,res)=>{
    const roles=Role.find({deleted:false});
    res.render(`admin/pages/roles/index`,{
        title:'Nhóm phân quyền',
        roles:roles
    })
}