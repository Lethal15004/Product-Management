const Order=require('../../models/client/order.model');
const Cart=require('../../models/client/cart.model');
const Product=require('../../models/admin/product.model');
module.exports.index=async (req,res)=>{
    try {
        const cart=await Cart.findOne({
            _id:req.cookies.cartId
        })
        let listProducts=cart.products;
        let totalMoney=0;
        for(let product of listProducts){
            const productInfo=await Product.findOne({_id:product.productId}).select("title thumbnail slug price discountPercentage");
            product.productInfo=productInfo;
            product.productInfo.priceNew=((1-product.productInfo.discountPercentage/100)*product.productInfo.price).toFixed(0);
            product.totalPrice=(product.productInfo.priceNew*product.quantity).toFixed(0);
            totalMoney+=Number(product.totalPrice);
        }
        res.render('client/pages/checkout/index',{
            title: 'Đặt hàng',
            listProductsCart:listProducts,
            totalMoney: totalMoney  
        });
    } catch (error) {
        req.flash('error','Có lỗi xảy ra, vui lòng thử lại sau');
        res.redirect('/cart');
    }
    
}