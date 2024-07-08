const productsCategory=require('../../models/admin/product-category.model');
const systemConfig=require('../../config/system');
const createTreeHelper=require('../../helpers/createTreRecursion.helper');


module.exports.index=async (req,res)=>{
    const find={
        deleted:false
    }
    const records=await productsCategory.find(find);
    res.render(`${systemConfig.prefixAdmin}/pages/products-category/index`,{
        title:'Danh mục sản phẩm',
        records:records
    })
}

module.exports.createPage=async (req,res)=>{
    const categories=await productsCategory.find({deleted:false});
    const newCategories = createTreeHelper(categories);
    res.render(`${systemConfig.prefixAdmin}/pages/products-category/products-category-create`,{
        title:'Thêm mới danh mục sản phẩm',
        categories:newCategories
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

module.exports.changeSingleStatus=async (req,res)=>{    
    try {
        const {id,status}=req.params;
        await productsCategory.updateOne({_id:id},{status:status});
        req.flash('success','Cập nhật trạng thái thành công');
        res.json({code:200});
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.json({code:400});
    }
}

module.exports.changePosition=async (req,res)=>{
    try {
        const {id,position}=req.params;
        await productsCategory.updateOne({_id:id},{position:position});
        req.flash('success','Cập nhật vị trí thành công');
        res.json({code:200});
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.json({code:400});
    }
}

module.exports.removeCategory=async (req,res)=>{
    try {
        const id = req.params.id;
        await productsCategory.updateOne({_id:id},{deleted:true});
        req.flash('success','Xóa danh mục thành công');
        res.json({code:200});
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.json({code:400});
    }
}

module.exports.detailCategory=async (req,res)=>{
    try {
        const id = req.params.id;
        const record=await productsCategory.findOne({_id:id,deleted:false});
        if(record.parent_id!==''){
            const record_parent=await productsCategory.findOne({_id:record.parent_id});
            record.parent_name=record_parent.title;
        }else{
            record.parent_name='Không có danh mục cha';
        }
        res.render(`${systemConfig.prefixAdmin}/pages/products-category/products-category-detail`,{
            title:'Chi tiết danh mục sản phẩm',
            record:record
        })
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
   
}

module.exports.pageEditCategory=async (req,res)=>{
    try {
        const id = req.params.id;
        const categoryFind=await productsCategory.findOne({_id:id,deleted:false});
        const categories=await productsCategory.find({deleted:false});
        const newCategories= createTreeHelper(categories);
        res.render(`${systemConfig.prefixAdmin}/pages/products-category/products-category-edit`,{
            title:'Chỉnh sửa danh mục sản phẩm',
            categories:newCategories,
            categoryFind:categoryFind
    })
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
    }
    
}

module.exports.editCategory=async (req,res)=>{
    try {
        console.log(req.body)
        const id = req.params.id;
        if(req.body.position!==''){
            req.body.position=Number(req.body.position);
        }else{
            const count = await productsCategory.countDocuments();
            req.body.position=count+1;
        }
        await productsCategory.updateOne({_id:id},req.body);
        req.flash('success','Cập nhật danh mục thành công');
        res.redirect(`back`);
    } catch (error) {
        req.flash('error','ID danh mục không tồn tại hoặc đã bị xóa');
        res.redirect(`back`);
    }
}