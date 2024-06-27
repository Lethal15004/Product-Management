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

module.exports.detail= async (req,res)=>{
    const find={
        status:'active',
        deleted:false
    }
    find.slug=req.params.slug;
    const product= await Products.findOne(find);
    console.log(product);
    res.send('OKE');
}