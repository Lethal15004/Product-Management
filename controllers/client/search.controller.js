const Products=require('../../models/admin/product.model');
const paginationHelper =require('../../helpers/pagination.helper');
module.exports.index= async (req,res)=>{
    const keyword=req.query.keyword;
    let listProducts=[];
    let pagination={};
    if(keyword){
        // Search products by keyword
        const keywordRegex= new RegExp(keyword,'i');
        const find={
            title:keywordRegex,
            deleted:false,
            status:'active'
        }
        pagination= await paginationHelper(req,Products,find,8);
        listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip).sort({position:"desc"});

        for(const product of listProducts){
            product.newPrice=Math.floor(((1-product.discountPercentage/100)*product.price));
        }
    }
    res.render('client/pages/search/index',{
        title:'Tìm kiếm sản phẩm',
        keyword:keyword,
        listProducts:listProducts,
        pagination:pagination
    })
}