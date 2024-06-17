const homeRoute=require('./home.route');
const productRoute=require('./product.route');

module.exports.index = (app)=>{
    app.use('/home', homeRoute)
    app.use('/products', productRoute)
}