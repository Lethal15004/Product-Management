const Cart=require('../../models/client/cart.model');
const Products=require('../../models/admin/product.model');
module.exports.index = (req,res)=>{
    res.send('OKE');
}

//Thêm sản phẩm vào giỏ hàng
module.exports.add=async(req,res)=>{
    try {
        const productId=req.params.id;
        const cartId=req.cookies.cartId;
        const quantity=Number(req.body.quantity);
        const cart=await Cart.findOne({
            _id:cartId
        })
        const productExist=cart.products.find(product=>product.productId===productId);

        //Kiểm tra sản phẩm có tồn tại trong giỏ hàng chưa
        if(productExist){
            //Nếu sản phẩm đã tồn tại thì cập nhật số lượng
            await Cart.updateOne({
                _id:cartId,
                "products.productId":productId
            },{
                $set:{
                    "products.$.quantity":productExist.quantity+quantity
                }
            })
        }else{
            //Nếu sản phẩm chưa tồn tại thì thêm mới
            await Cart.updateOne({
                _id:cartId
            },{
                $push:{
                    products:
                    {
                        productId:productId,
                        quantity:quantity
                    }
                }
            })
        }
        req.flash('success','Thêm sản phẩm vào giỏ hàng thành công');
        res.redirect('back');
    } catch (error) {
        req.flash('error','Lỗi thêm sản phẩm vào giỏ hàng');
        res.redirect('back');
    }
}