const Products=require('../../models/admin/product.model');
const paginationHelper=require('../../helpers/pagination.helper');
module.exports= async (req,res)=>{
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


    const listProducts= await Products.find(find).limit(pagination.limitItems).skip(pagination.skip);
    // limit là giới hạn số lượng bản ghi trả về và skip là bỏ qua bao nhiêu bản ghi
    
    res.render('admin/pages/products/index',{
        title:'Products',
        Products:listProducts,
        keyword:req.query.keyword,
        buttonFilters:buttonFilters,
        pagination:pagination,
    });
}