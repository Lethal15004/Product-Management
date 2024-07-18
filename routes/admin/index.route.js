const dashboardRoute = require('./dashboard.route');
const productsRoute=require('./products.route');
const adminConfig=require('../../config/system');
const productCategoryRoute=require('./products-category.route');
const rolesRoute=require('./role.route');
const accountsRoute=require('./account.route');
const authRoute=require('./auth.route');
const profileRoute=require('./profile.route');

const middlewareAuth=require('../../middleware/admin/auth.middleware');
module.exports.index=(app)=>{
    app.use(`/${adminConfig.prefixAdmin}/dashboard`,middlewareAuth,dashboardRoute);
    app.use(`/${adminConfig.prefixAdmin}/products`,middlewareAuth,productsRoute);
    app.use(`/${adminConfig.prefixAdmin}/products-category`,middlewareAuth,productCategoryRoute);
    app.use(`/${adminConfig.prefixAdmin}/roles`,middlewareAuth,rolesRoute);
    app.use(`/${adminConfig.prefixAdmin}/accounts`,middlewareAuth,accountsRoute);
    app.use(`/${adminConfig.prefixAdmin}/profile`,middlewareAuth,profileRoute);
    app.use(`/${adminConfig.prefixAdmin}/auth`,authRoute);
}