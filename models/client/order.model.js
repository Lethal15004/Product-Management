const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    userInfo:{
        fullName:{
            type:String,
            required: true
        },
        phone:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true  
        }
    },
    products:[
        {
            productId: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ],
    status:{
        type:String,
        default:"pending"
    },
    expireAt: 
    { 
        type: Date,  
        expires: 0
    }
},{
    timestamps:true
}
)
const Order= mongoose.model('Order',orderSchema,'orders');
module.exports=Order;