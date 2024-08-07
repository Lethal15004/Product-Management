const Products=require('../../models/admin/product.model')
const paginationHelper=require('../../helpers/pagination.helper')
module.exports.index=async(req,res)=>{
    const find={
        deleted:true
    }
    const buttonFilters=[
        {
            status:"",
            title:"Tất cả"
        },
        {
            status:"active",
            title:"Hoạt động"
        },
        {
            status:"inactive",
            title:"Dừng hoạt động"
        }
    ]
    if(req.query.status){
        find.status=req.query.status;
    }
    let keyword="";
    if(req.query.keyword){
        const regex=new RegExp(req.query.keyword,'i');
        find.title=regex;
        keyword=req.query.keyword;
    }
    const pagination=await paginationHelper(req,Products,find);
    const listProducts=await Products.find(find).limit(pagination.limitItems).skip(pagination.skip).sort({position:"asc"})
    res.render('admin/pages/products/products-trash',{
        title:'Quản lý sản phẩm đã xóa',
        buttonFilters:buttonFilters,
        Products:listProducts,
        pagination:pagination,
        keyword:keyword,
        path:req.path
    });
}

module.exports.restoreProduct=async(req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const id=req.params.id;
            await Products.updateOne({_id:id},{deleted:false});
            req.flash('success','Khôi phục sản phẩm thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','Khôi phục sản phẩm thất bại');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }

}

module.exports.removeProduct=async(req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const id=req.params.id;
            await Products.deleteOne({_id:id});
            req.flash('success','Xóa sản phẩm vĩnh viễn thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','Xóa sản phẩm vĩnh viễn thất bại');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }
}