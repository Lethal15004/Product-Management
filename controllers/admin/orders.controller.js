const Order=require('../../models/client/order.model');
const Product=require('../../models/admin/product.model');

const moment = require('moment');  
module.exports.index= async (req,res)=>{
    const find={}
    if(req.query.status){
        find.status=req.query.status
    }
    if(req.query.keyword){
        const fullName=new RegExp(req.query.keyword,'i');
        find['userInfo.fullName']=fullName;
    }
    const buttonFilters=[
        {
            status:"",
            title:"Tất cả"
        },
        {
            status:"pending",
            title:"Chờ xác nhận"
        },
        {
            status:"accepted",
            title:"Đã xác nhận"
        },
        {
            status:"cancelled",
            title:"Đã hủy"
        }
    ]
    const orders= await Order.find(find);
    for(const order of orders){
        let totalMoney=0;
        for(const item of order.products){
            const priceNew=((1-item.discountPercentage/100)*item.price).toFixed(0);
            totalMoney+=priceNew*item.quantity;
        }
        order.totalMoney=totalMoney;
        order.createdAtFormat=moment(order.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    res.render('admin/pages/orders/index',{
        title:"Danh sách đơn hàng",
        orders:orders,
        buttonFilters:buttonFilters,
        status:find.status,
        keyword:req.query.keyword
    })
}

module.exports.detail= async (req,res)=>{
    try {
        const id =req.params.id;
        const order= await Order.findOne({_id:id});
        const listProducts=[];
        let totalMoney=0;

        for(const item of order.products){
            const productInfo=await Product.findOne({_id:item.productId,deleted:false,status:'active'}).select('title price discountPercentage thumbnail slug')
            const priceNew=((1-item.discountPercentage/100)*item.price).toFixed(0);
            productInfo.priceNew=priceNew;
            productInfo.quantity=item.quantity;
            productInfo.totalPrice=priceNew*item.quantity;
            listProducts.push(productInfo);
            totalMoney+=priceNew*item.quantity;
        }
        order.totalMoney=totalMoney;
        res.render('admin/pages/orders/order-detail',{
            title:"Chi tiết đơn hàng",
            order:order,
            listProducts:listProducts
        })
    } catch (error) {
        req.flash('error','Lỗi: '+error);
        res.redirect('/admin/orders');
    }
}

module.exports.accept= async (req,res)=>{   
    try{
        const id =req.params.id;
        const order= await Order.findOne({_id:id});
        if(order.status !=='pending'){
            res.json({
                code:404,
                message:"Đơn hàng này đã được xác nhận hoặc đã bị hủy."
            });
            return;
        }
        await Order.updateOne({_id:id},{status:'accepted'});
        res.json({
            code:200,
            message:"Đơn hàng này đã được xác nhận."
        });
    }catch(error){
        res.json({
            code:404,
            message:"Lỗi: "+error
        })
    }
}

module.exports.cancel= async (req,res)=>{   
    try{
        const id =req.params.id;
        const order= await Order.findOne({_id:id});
        if(order.status !=='pending'){
            res.json({
                code:404,
                message:"Đơn hàng này đã được xác nhận hoặc đã bị hủy."
            });
            return;
        }
        await Order.updateOne({_id:id},{status:'cancelled',expireAt: Date.now() + 24*60*60*1000});
        res.json({
            code:200,
            message:"Đơn hàng này đã bị hủy"
        });
    }catch(error){
        res.json({
            code:404,
            message:"Lỗi: "+error
        })
    }
}