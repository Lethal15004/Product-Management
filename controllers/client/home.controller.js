const Products=require('../../models/admin/product.model');
module.exports.index= async (req,res)=>{

    const listProductsFeatured=await Products.find({
        deleted:false,
        status:'active',
        featured:'1'
    }).limit(8).select('-description');

    for(const product of listProductsFeatured){
        const priceNew=Math.floor((1-(product.discountPercentage/100))*product.price);
        product.priceNew=priceNew;
    }

    const listProductsNew=await Products.find({
        deleted:false,
        status:'active',
    }).sort({position:'desc'}).limit(8).select('-description');
    for(const product of listProductsNew){
        const priceNew=Math.floor((1-(product.discountPercentage/100))*product.price);
        product.priceNew=priceNew;
    }

    res.render('client/pages/home/index',{
        title:'Trang chủ',
        categories:res.locals.categories,
        listProductsFeatured:listProductsFeatured,
        listProductsNew:listProductsNew
    });
}