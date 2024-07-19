const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productsSchema = new mongoose.Schema({
    title: String,
    product_category_id:String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    featured:String,
    status: String,
    position: Number,
    createdBy:String,
    updatedBy:String,
    deletedBy:String,
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