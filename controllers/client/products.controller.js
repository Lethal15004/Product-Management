const Products=require('../../models/admin/product.model');
const categoryProducts=require('../../models/admin/product-category.model');
const paginationHelper=require('../../helpers/pagination.helper');
module.exports.index= async (req,res)=>{
    const find={
        status:'active',
        deleted:false
    }
    const pagination= await paginationHelper(req,Products,find,8);

    const listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip).sort({position:"desc"});
    for(const item of listProducts){
        item.newPrice=((1-item.discountPercentage/100)*item.price).toFixed(0);
    }
    res.render('client/pages/products/index',{
        title:'Danh sách sản phẩm',
        listProducts:listProducts,
        pagination:pagination
    })
}

module.exports.detail= async (req,res)=>{
    const find={
        status:'active',
        deleted:false
    }
    find.slug=req.params.slug;
    const product= await Products.findOne(find);
    const category= await categoryProducts.findOne({_id:product.product_category_id}).select('title slug');
    if(product){
        res.render('client/pages/products/detail',{
            title:'Chi tiết sản phẩm',
            product:product,
            category:category
        })
    }else{
        req.flash('error','Không tìm thấy sản phẩm');
        res.redirect('/products');
    }
}

module.exports.category= async (req,res)=>{
    const slug= req.params.slug;
    const allCategoriesFind=[];
    
    const category = await categoryProducts.findOne({
        status:'active',
        deleted:false,
        slug:slug
    }).select('parent_id');
    allCategoriesFind.push(category.id);

    const getSubCategory = async (currentId)=>{
        const listCategories= await categoryProducts.find({
            parent_id:currentId,
            status:'active',
            deleted:false
        })
        for(const category of listCategories){
            allCategoriesFind.push(category.id);
            await getSubCategory(category.id);
        }
    }
    await getSubCategory(category.id);

    const find={
        product_category_id:{
            $in:allCategoriesFind
        },
        status:'active',
        deleted:false
    }
    const pagination= await paginationHelper(req,Products,find,8);
    const listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip).select('-description')
    for(const item of listProducts){
        item.newPrice=((1-item.discountPercentage/100)*item.price).toFixed(0);
    }
    res.render('client/pages/products/index',{
        title:'Danh sách sản phẩm',
        listProducts:listProducts,
        pagination:pagination
    })
}