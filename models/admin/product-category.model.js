const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema({
    title: String,
    parent_id:{
        type:String,
        default:''
    },
    description: String,
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
}
)
const productsCategory= mongoose.model('productsCategory',productCategorySchema,'products-category');
module.exports=productsCategory;