const Cart=require('../../models/client/cart.model');
module.exports=async (req,res,next)=>{
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        const expires= 365*24*60*60*1000;
        res.cookie('cartId',cart.id,{
            expires: new Date(Date.now()+expires),
        });
    }else{
        const cart=await Cart.findOne({
            _id:req.cookies.cartId
        })
        res.locals.cartTotal=cart.products.length||0;
    }
    next();
}