const Products=require('../../models/admin/product.model');
module.exports.index= async (req,res)=>{
    const listProducts= await Products.find({
        status:'active',
        deleted:false
    }).sort({position:"desc"});
    for(const item of listProducts){
        item.newPrice=((1-item.discountPercentage/100)*item.price).toFixed(0);
    }
    res.render('client/pages/products/index',{
        title:'Danh sách sản phẩm',
        listProducts:listProducts
    })
}