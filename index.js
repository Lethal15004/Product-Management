const express = require('express');//Nhúng express vào dự án
const app = express(); // Khởi tạo ưng dụng web sử dụng express
const routeClient=require('./routes/client/index.route');//Nhúng route vào dự án
const adminRoute=require('./routes/admin/index.route');//Nhúng route vào dự án
const systemConfig=require('./config/system');//Nhúng file cấu hình vào dự án
require('dotenv').config()

//Kết noối database
const database=require('./config/database');
database.connect();

// Chú ý để nhúng file vào dự án thì cần phải sử dụng đúng đường dẫn và require
// Chú ý đường dẫn cùng cấp thì mặc định bắt đầu là ./ . Từ con ra cha là ../ . 
// Chú ý render thì đường dẫn nó đã mặc định ./view + đường dẫn 
    // Example: res.render('client/pages/home/index'); sẽ là /views/client/pages/home/index.pug
// Chú ý folder .env để chứa các biến môi trường (port, database, secret key, ...)
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'))

//Local variable -> Chỉ áp dụng cho file pug
app.locals.prefixAdmin=systemConfig.prefixAdmin;

routeClient.index(app);
adminRoute.index(app);

app.listen(process.env.PORT, () => {
    console.log(`Đang lắng nghe cổng http://localhost:${process.env.PORT}`);
})