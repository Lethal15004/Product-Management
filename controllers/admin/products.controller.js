const Products=require('../../models/admin/product.model');
const paginationHelper=require('../../helpers/pagination.helper');


//[GET] /admin/products
module.exports.index= async (req,res)=>{
    const find={
        deleted:false
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
    //Tìm kiếm backend
    if(req.query.keyword){
        const regex=new RegExp(req.query.keyword,'i');
        find.title=regex;
    }

    //Lọc theo status backend
    if(req.query.status){
        find.status=req.query.status;
    }

    //Phân trang backend
    const pagination = await paginationHelper(req,Products,find);

    const listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip)
                                     .sort({position:"desc"});
    // limit là giới hạn số lượng bản ghi trả về và skip là bỏ qua bao nhiêu bản ghi
    console.log(listProducts);
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
    const { id , status }=req.body;
    await Products.updateOne({_id: id},{status: status});
    req.flash('success','Cập nhật trạng thái thành công');
    res.json({
        code:200
    })
}

//[PATCH] /admin/products/change-multi-status
module.exports.changeProducts=async (req,res)=>{
    const {ids,status}=req.body;
    switch(status){
        case 'active':
        case 'inactive':
            await Products.updateMany({_id:ids},{status:status});
            break;
        case "delete":
            await Products.updateMany({_id:ids},{deleted:true});
            break;
        case "restore":
            await Products.updateMany({_id:ids},{deleted:false});
            break;
        case "remove":
            await Products.deleteMany({_id:ids});
            break;
        default:
            break;
    }
    res.json({
        code:200
    })
}

//[DELETE] /admin/products/delete/:id
module.exports.deleteProduct=async (req,res)=>{
    const {id}=req.params;
    await Products.updateOne({_id:id},{deleted:true});
    req.flash('success','Xóa sản phẩm thành công');
    res.json({
        code:200
    })
}

//[PATCH] /admin/products/changePosition/:id/:position
module.exports.changePosition=async (req,res)=>{
    const {id,position}=req.params;
    await Products.updateOne({_id:id},{position:position});
    res.json({
        code:200
    })
}

module.exports.create=async (req,res)=>{
    res.render('admin/pages/products/product-create',{
        title:'Tạo sản phẩm mới'
    });
}

module.exports.createProduct=async (req,res)=>{
    req.body.price=Number(req.body.price);
    req.body.discountPercentage=Number(req.body.discountPercentage);
    req.body.stock=Number(req.body.stock);
    if(req.body.position!==''){
        req.body.position=Number(req.body.position);
    }else{
        const totalProducts=await Products.countDocuments();
        req.body.position=totalProducts+1;
    }
    const newProduct = new Products(req.body);
    await newProduct.save()
    .then(()=>{
        req.flash('success','Tạo sản phẩm thành công');
        res.redirect('/admin/products');
    })
}


