const mongoose = require('mongoose');
const moment = require('moment-timezone');//chưa sử dụng
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productsSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug:{
        type:String,
        slug:"title",// Tạo slug từ trường title
        unique:true
    },
    deleted:{
        type: Boolean,
        default: false
    },
},{
    timestamps:true
}) 
const Product= mongoose.model('Product',productsSchema,'products');
module.exports=Product;