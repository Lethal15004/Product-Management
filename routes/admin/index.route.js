const dashboardRoute = require('./dashboard.route');
const productsRoute=require('./products.route');
const adminConfig=require('../../config/system');
const productCategoryRoute=require('./products-category.route');
module.exports.index=(app)=>{
    app.use(`/${adminConfig.prefixAdmin}/dashboard`,dashboardRoute)
    app.use(`/${adminConfig.prefixAdmin}/products`,productsRoute)
    app.use(`/${adminConfig.prefixAdmin}/products-category`,productCategoryRoute)
}