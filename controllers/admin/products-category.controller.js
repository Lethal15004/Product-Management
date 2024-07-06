const productsCategory=require('../../models/admin/product-category.model');
const systemConfig=require('../../config/system');



module.exports.index=async (req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/products-category/index`,{
        title:'Danh mục sản phẩm'
    })
}

module.exports.createPage=async (req,res)=>{
    res.render(`${systemConfig.prefixAdmin}/pages/products-category/products-category-create`,{
        title:'Thêm mới danh mục sản phẩm'
    })
}

module.exports.createCategory=async (req,res)=>{
    if(req.body.position!==''){
        req.body.position=Number(req.body.position);
    }else{
        const countProducts=await productsCategory.countDocuments();
        req.body.position=countProducts+1;
    }
    const newCategory= new productsCategory(req.body);
    await newCategory.save()
    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}