const Cart=require('../../models/client/cart.model');
const Products=require('../../models/admin/product.model');
module.exports.index = async (req,res)=>{
    try {
        const cart = await Cart.findOne({
            _id:req.cookies.cartId
        })
        const listProductsCart=cart.products;
        let totalMoney=0;
        if(listProductsCart.length>0){
            for(const product of listProductsCart){
                const productInfo=await Products.findOne({
                    _id:product.productId,
                    status:'active',
                    deleted:false
                }).select("title thumbnail slug price discountPercentage");
                product.productInfo=productInfo;
                product.productInfo.priceNew=((1-product.productInfo.discountPercentage/100)*product.productInfo.price).toFixed(0);
                product.productInfo.totalPrice=(product.productInfo.priceNew*product.quantity).toFixed(0);
                totalMoney+=Number(product.productInfo.totalPrice);
            }
        }
        res.render('client/pages/cart/index',{
            title:'Giỏ hàng',
            listProductsCart:listProductsCart,
            totalMoney:totalMoney
        })
    } catch (error) {
        req.flash('error','Lỗi truy cập giỏ hàng');
        res.redirect('/products');
    }
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

module.exports.delete=async(req,res)=>{
    try {
        const idProduct=req.params.id;
        const idCart=req.cookies.cartId;
        await Cart.updateOne({
            _id:idCart,
        },{
            $pull:{
                products:{
                    productId:idProduct
                }
            }
        })
        req.flash('success','Xóa sản phẩm khỏi giỏ hàng thành công');
        res.redirect('back');
    } catch (error) {
        req.flash('error','Lỗi xóa sản phẩm khỏi giỏ hàng');
        res.redirect('back');
    }
}