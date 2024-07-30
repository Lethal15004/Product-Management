const Order=require('../../models/client/order.model');
const Product=require('../../models/admin/product.model');

const moment = require('moment');  
module.exports.index= async (req,res)=>{
    const orders= await Order.find();
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
        orders:orders
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