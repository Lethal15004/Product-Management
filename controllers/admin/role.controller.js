const Role=require('../../models/admin/role.model');
const systemConfig=require('../../config/system');

module.exports.index=async (req,res)=>{
    const roles = await Role.find({deleted:false});
    res.render(`${systemConfig.prefixAdmin}/pages/roles/index`,{
        title:'Nhóm phân quyền',
        roles:roles
    })
}

module.exports.createPage=(req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/roles/role-create`,{
        title:'Thêm mới nhóm quyền'
    })
}

module.exports.createRole= async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('roles_create')){
        const newRole= new Role(req.body);
        await newRole.save()
        .then(()=>{
            req.flash('success','Tạo nhóm phân quyền thành công');
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        })
    }else{
        res.send('403');
    }
    
}

module.exports.editPage=async (req,res)=>{
    try {
        const id =req.params.id;
        const role=await Role.findOne({
            _id:id,
            deleted:false
        })
        if(role){
            res.render(`${systemConfig.prefixAdmin}/pages/roles/role-edit`,{
                title:'Chỉnh sửa nhóm quyền',
                role:role
            })
        }
        else{
            req.flash('error','ID nhóm quyền không hợp lệ')
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash('error','ID nhóm quyền không hợp lệ')
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.editRole=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('roles_edit')){
        try {
            const id=req.params.id;
            await Role.updateOne({
                _id:id
            },req.body)
            req.flash('success','Chỉnh sửa nhóm quyền thành công');
            res.redirect('back');
        } catch (error) {
            req.flash('error','ID nhóm quyền không hợp lệ');
            res.redirect('back');
        }
    }else{
        res.send('403');
    }
    
}

module.exports.detailPage=async (req,res)=>{
    try {
        const id =req.params.id;
        const role=await Role.findOne({
            _id:id,
            deleted:false
        })
        if(role){
            res.render(`${systemConfig.prefixAdmin}/pages/roles/role-detail`,{
                title:'Chỉnh sửa nhóm quyền',
                role:role
            })
        }
        else{
            req.flash('error','ID nhóm quyền không hợp lệ')
            res.redirect(`/${systemConfig.prefixAdmin}/roles`);
        }
    } catch (error) {
        req.flash('error','ID nhóm quyền không hợp lệ')
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
}

module.exports.removeRole=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('roles_deleted')){
        try {
            const id= req.params.id;
            await Role.updateOne({
                _id:id
            },{deleted:true})
            req.flash('success','Xóa nhóm quyền thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','ID nhóm quyền không hợp lệ');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }

}

module.exports.permissionsPage=async (req,res)=>{
    const roles=await Role.find({deleted:false});
    const dataAuthorizations=[
        {
            title:'Danh sách sản phẩm',
            data: 'products' 
        },
        {
            title:'Danh mục sản phẩm',
            data: 'products-category' 
        },
        {
            title:'Nhóm quyền',
            data: 'roles' 
        },
        {
            title:'Tài khoản admin',
            data: 'accounts' 
        },
        {
            title:'Đơn hàng',
            data: 'orders'
        }
    ]
    res.render(`${systemConfig.prefixAdmin}/pages/roles/role-permissions`,{
        title:'Phân quyền',
        roles:roles,
        dataAuthorizations:dataAuthorizations
    })
}

module.exports.updatePermissions=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('roles_permissions')){
        if(req.body.length>0){
            req.body.forEach( async (item) => {
                try {
                    await Role.updateOne({
                        _id:item.id,
                        deleted:false
                    },{
                        permissions:item.permissions
                    })
                } catch (error) {
                    res.json({
                        code:500,
                        message: "Cập nhật thất bại!"
                    })
                }
            });
            res.json({
                code:200,
                message: "Cập nhật thành công!"
            })
        }
        else{
            res.json({
                code:500,
                message: "Cập nhật thất bại!"
            })
        }
    }else{
        res.send('403');
    }
}