const Order=require('../../models/client/order.model');
const Cart=require('../../models/client/cart.model');
const Product=require('../../models/admin/product.model');
const User=require('../../models/client/user.model');
module.exports.index=async (req,res)=>{
    try {
        const tokenUser=req.cookies.tokenUser;
        let user;
        if(tokenUser){
            user=await User.findOne({tokenUser:tokenUser,deleted:false,status:"active"}) || null;
        }
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
            totalMoney: totalMoney,
            user:user
        });
    } catch (error) {
        req.flash('error','Có lỗi xảy ra, vui lòng thử lại sau');
        res.redirect('/cart');
    }
    
}

module.exports.order=async (req,res)=>{
    if(!req.body.fullName || !req.body.phone || !req.body.address){
        req.flash('error','Vui lòng nhập đầy đủ thông tin');
        res.redirect('/checkout');
    }else{
        const dataSave ={
            userInfo:{
                fullName: req.body.fullName,
                phone: req.body.phone,
                address: req.body.address
            },
            products:[],
        }
        const cart=await Cart.findOne({
            _id:req.cookies.cartId
        })
    
        let listProductsCart=cart.products;
        for(let product of listProductsCart){
            const dataPush={}
            const productInfo=await Product.findOne({_id:product.productId}).select("price discountPercentage");
            dataPush.productId=product.productId;
            dataPush.quantity=product.quantity;
            dataPush.price=productInfo.price;
            dataPush.discountPercentage=productInfo.discountPercentage;
            dataSave.products.push(dataPush);
        }
        const newOrder= new Order(dataSave);
        newOrder.save();

        await Cart.updateOne({
            _id:req.cookies.cartId
        },{
            products:[]
        })
        res.redirect(`/checkout/success/${newOrder.id}`);
    }
}

module.exports.success=async (req,res)=>{
    const order=await Order.findOne({
        _id:req.params.orderId
    })
    let totalMoney=0;
    for(let product of order.products){
        const productInfo=await Product.findOne({_id:product.productId}).select("title thumbnail slug price discountPercentage");
        product.title=productInfo.title;
        product.thumbnail=productInfo.thumbnail;
        product.priceNew=((1-product.discountPercentage/100)*product.price).toFixed(0);
        product.totalPrice=(product.priceNew*product.quantity).toFixed(0);
        totalMoney+=Number(product.totalPrice);
    }
    res.render('client/pages/checkout/success',{
        title: 'Đặt hàng thành công',
        order: order,
        totalMoney: totalMoney
    })
}
