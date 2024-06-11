const Products=require('../../models/admin/product.model');
module.exports= async (req,res)=>{
    const find={
        deleted:false
    }

    //Tìm kiếm
    if(req.query.keyword){
        const regex=new RegExp(req.query.keyword,'i');
        find.title=regex;
    }

    //Lọc theo status
    if(req.query.status){
        find.status=req.query.status;
    }
    const listProducts= await Products.find(find);
    res.render('admin/pages/products/index',{
        title:'Products',
        Products:listProducts,
        keyword:req.query.keyword,
    });
}