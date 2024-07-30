const Order=require('../../models/client/order.model');
const Product=require('../../models/admin/product.model');

const moment = require('moment');  
module.exports.index= async (req,res)=>{
    const orders= await Order.find();
    for(const product of orders){
        let totalMoney=0;
        for(const item of product.products){
            const priceNew=((1-item.discountPercentage/100)*item.price).toFixed(0);
            totalMoney+=priceNew*item.quantity;
        }
        product.totalMoney=totalMoney;
        product.createdAtFormat=moment(product.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    res.render('admin/pages/orders/index',{
        title:"Danh sách đơn hàng",
        orders:orders
    })
}