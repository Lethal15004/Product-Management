const Cart=require('../../models/client/cart.model');
module.exports=async (req,res,next)=>{
    if(!req.cookies.cartId){
        const cart = new Cart();
        await cart.save();
        const expires= 365*24*60*60*1000;
        res.cookie('cartId',cart.id,{
            expires: new Date(Date.now()+expires),
        });
    }
    next();
}