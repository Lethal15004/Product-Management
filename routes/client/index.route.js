const homeRoute=require('./home.route');
const productRoute=require('./product.route');
const categoryMiddleware=require('../../middleware/client/category.middleware');
module.exports.index = (app)=>{
    app.use(categoryMiddleware);
    app.use('/', homeRoute);
    app.use('/products', productRoute);
}