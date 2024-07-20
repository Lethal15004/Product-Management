const homeRoute=require('./home.route');
const productRoute=require('./product.route');
const categoryMiddleware=require('../../middleware/client/category.middleware');
const searchRoute=require('./search.route');
module.exports.index = (app)=>{
    app.use(categoryMiddleware);
    app.use('/', homeRoute);
    app.use('/products', productRoute);
    app.use('/search', searchRoute);
}