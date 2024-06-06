const dashBoardRoute=require('./dashboard.route');
const productRoute=require('./products.route');
module.exports.index=(app)=>{
    app.use('/admin/dashboard', dashBoardRoute)
    app.use('/admin/products', productRoute)
}