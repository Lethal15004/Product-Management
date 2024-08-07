const Products=require('../../models/admin/product.model');
const Account=require('../../models/admin/account.model.js');
const productsCategory=require('../../models/admin/product-category.model');

const paginationHelper=require('../../helpers/pagination.helper');
const createTreeHelper=require('../../helpers/createTreRecursion.helper.js');
const system=require('../../config/system.js');

const moment=require('moment');
//[GET] /admin/products
module.exports.index= async (req,res)=>{
        const find={
            deleted:false
        }
        const sort={}
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
        //Tìm kiếm backend
        if(req.query.keyword){
            const regex=new RegExp(req.query.keyword,'i');
            find.title=regex;
        }

        //Lọc theo status backend
        if(req.query.status){
            find.status=req.query.status;
        }

        //Sắp xếp theo tiêu chí
        if(req.query.sortKey&&req.query.sortValue){
            sort[req.query.sortKey]=req.query.sortValue;
        }else{
            sort['position']='desc';
        }


        //Phân trang backend
        const pagination = await paginationHelper(req,Products,find,4);
        
        const listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip)
                                        .sort(sort);
        for(const product of listProducts){
            if(product.createdBy){
                const account=await Account.findOne({_id:product.createdBy}).select('fullName');
                product.nameCreated=account.fullName;
            }else{
                product.nameCreated='';
            }
            product.createdAtFormat=moment(product.createdAt).format('DD/MM/YYYY HH:mm:ss');
        }
        // limit là giới hạn số lượng bản ghi trả về và skip là bỏ qua bao nhiêu bản ghi
        res.render('admin/pages/products/index',{
            title:'Products',
            Products:listProducts,
            keyword:req.query.keyword,
            buttonFilters:buttonFilters,
            pagination:pagination,
        });
}

//[PATCH] /admin/products/change-single-status
module.exports.changeSingleStatus=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const { id , status }=req.body;
            await Products.updateOne({_id: id},{status: status,updatedBy:res.locals.accountUser._id});
            req.flash('success','Cập nhật trạng thái thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','ID sản phẩm không hợp lệ');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }
    
}

//[PATCH] /admin/products/change-multi-status
module.exports.changeProducts=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const {ids,status}=req.body;
            switch(status){
                case 'active':
                case 'inactive':
                    await Products.updateMany({_id:ids},{status:status,updatedBy:res.locals.accountUser._id});
                    break;
                case "delete":
                    await Products.updateMany({_id:ids},{deleted:true,deletedBy:res.locals.accountUser._id});
                    break;
                case "restore":
                    await Products.updateMany({_id:ids},{deleted:false,updatedBy:res.locals.accountUser._id});
                    break;
                case "remove":
                    await Products.deleteMany({_id:ids});
                    break;
                default:
                    break;
            }
            req.flash('success','Cập nhật trạng thái thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','ID sản phẩm không hợp lệ');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }
    
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteProduct=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_delete')){
        try {
            const {id}=req.params;
            await Products.updateOne({_id:id},{deleted:true,deletedBy:res.locals.accountUser._id});
            req.flash('success','Xóa sản phẩm thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','ID sản phẩm không hợp lệ');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }

}

//[PATCH] /admin/products/changePosition/:id/:position
module.exports.changePosition=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const {id,position}=req.params;
            await Products.updateOne({_id:id},{position:position,updatedBy:res.locals.accountUser._id});
            req.flash('success','Thay đổi vị trí thành công');
            res.json({
                code:200
            })
        } catch (error) {
            req.flash('error','ID sản phẩm không hợp lệ');
            res.json({
                code:500
            })
        }
    }else{
        res.send('403');
    }
}

//[GET] /admin/products/create
module.exports.create=async (req,res)=>{
    const categories= await productsCategory.find({deleted:false});
    const newCategories= createTreeHelper(categories);
    res.render('admin/pages/products/product-create',{
        title:'Tạo sản phẩm mới',
        categories:newCategories
    });
}

//[POST] /admin/products/create
module.exports.createProduct=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_create')){
        req.body.price=Number(req.body.price);
        req.body.discountPercentage=Number(req.body.discountPercentage);
        req.body.stock=Number(req.body.stock);
        if(req.body.position!==''){
            req.body.position=Number(req.body.position);
        }else{
            const totalProducts=await Products.countDocuments();
            req.body.position=totalProducts+1;
        }
        req.body.createdBy=res.locals.accountUser._id;
        const newProduct = new Products(req.body);
        await newProduct.save()
        .then(()=>{
            req.flash('success','Tạo sản phẩm thành công');
            res.redirect('/admin/products');
        })
    }
    else{
        res.send('403');
    }
}

//[GET] /admin/products/pageChangeProduct/:id
module.exports.pageChangeProduct=async (req,res)=>{
    try {
        const product=await Products.findOne({
            _id:req.params.id,
            deleted:false
        })
        const categories= await productsCategory.find({deleted:false});
        const newCategories= createTreeHelper(categories);
        if(product){
            res.render('admin/pages/products/product-change',{
                title:'Chỉnh sửa sản phẩm',
                product:product,
                categories:newCategories,
            })
        }
        else{
            req.flash('error','ID sản phẩm không hợp lệ')
            res.redirect(`/${system.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash('error','ID sản phẩm không hợp lệ')
        res.redirect(`/${system.prefixAdmin}/products`);
    }
    
}

//[PATCH] /admin/products/changeProduct/:id
module.exports.changeProduct=async (req,res)=>{
    if(res.locals.roleUser.permissions.includes('products_edit')){
        try {
            const id= req.params.id;
            req.body.price=Number(req.body.price);
            req.body.discountPercentage=Number(req.body.discountPercentage);
            req.body.stock=Number(req.body.stock);
            if(req.body.position!==''){
                req.body.position=Number(req.body.position);
            }else{
                const totalProducts=await Products.countDocuments();
                req.body.position=totalProducts+1;
            }
            req.body.updatedBy=res.locals.accountUser._id;
            await Products.updateOne({
                _id:id,
                deleted:false
            },req.body);
            req.flash('success','Cập nhật sản phẩm thành công');
        } catch (error) {
            req.flash('error','ID sản phẩm không hợp lệ');
        }
        res.redirect(`back`);
    }else{
        res.send('403');
    }
    
}


//[GET] /admin/products/detail/:id
module.exports.pageDetailProduct=async (req,res)=>{
    try {
       const id=req.params.id;
       const product=await Products.findOne({
        _id:id,
        deleted:false
       })
       if(product.product_category_id){
            const category =await productsCategory.findOne({_id:product.product_category_id,deleted:false});
            product.category=category.title;
       }
        if(product.updatedBy){
            const account=await Account.findOne({_id:product.updatedBy}).select('fullName');
            product.nameUpdated=account.fullName;
        }
        if(product.deletedBy){
            const account=await Account.findOne({_id:product.deletedBy}).select('fullName');
            product.nameDeleted=account.fullName;
        }
        product.updatedAtFormat=moment(product.updatedAt).format('DD/MM/YYYY HH:mm:ss');
        if(product){
            res.render('admin/pages/products/product-detail',{
                title:'Thông tin chi tiết sản phẩm',
                product:product
            })
        }else{
            req.flash('error','ID sản phẩm không hợp lệ');
            res.redirect(`/${system.prefixAdmin}/products`);
        }
    } catch (error) {
        req.flash('error','ID sản phẩm không hợp lệ');
        res.redirect(`/${system.prefixAdmin}/products`);
    }
}
