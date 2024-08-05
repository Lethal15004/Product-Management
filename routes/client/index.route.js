const homeRoute=require('./home.route');
const productRoute=require('./product.route');
const searchRoute=require('./search.route');
const cartRoute=require('./cart.route');
const checkoutRoute=require('./checkout.route');
const userRoute=require('./user.route');
const chatRoute=require('./chat.route');
//middleware
const categoryMiddleware=require('../../middleware/client/category.middleware');
const cartMiddleware=require('../../middleware/client/cart.middleware');
const userMiddleware=require('../../middleware/client/user.middleware');
const settingMiddleware=require('../../middleware/admin/setting.middleware');
module.exports.index = (app)=>{
    app.use(cartMiddleware);
    app.use(categoryMiddleware);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware);
    app.use('/', homeRoute);
    app.use('/products', productRoute);
    app.use('/search', searchRoute);
    app.use('/cart', cartRoute);
    app.use('/checkout', checkoutRoute);
    app.use('/user', userRoute);
    app.use('/chat',userMiddleware.requireAuth,chatRoute)   
}