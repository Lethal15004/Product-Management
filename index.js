const express = require('express');//Nhúng express vào dự án
const app = express(); // Khởi tạo ưng dụng web sử dụng express
require('dotenv').config()//Nhúng file .env vào dự án
const flash= require('express-flash');//Nhúng flash vào dự án
const cookieParser = require('cookie-parser');//Nhúng cookie-parser vào dự án
const session = require('express-session');//Nhúng express-session vào dự án

const routeClient=require('./routes/client/index.route');//Nhúng route vào dự án
const adminRoute=require('./routes/admin/index.route');//Nhúng route vào dự án

const systemConfig=require('./config/system');//Nhúng file cấu hình vào dự án\
const database=require('./config/database');//Nhúng file cấu hình database vào dự án
database.connect();//Kết nối database



//Phần flash -> Để hiển thị thông báo (Quan trọng phải có)
app.use(cookieParser('alert-1x2'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//Phần view engine -> Để render file pug (Quan trọng phải có)
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

//Phần body-parser -> Để lấy dữ liệu từ form và fetch (Quan trọng phải có)
const bodyParser = require('body-parser');//Nhúng body-parser vào dự án
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Local variable -> Chỉ áp dụng cho file pug
app.locals.prefixAdmin=systemConfig.prefixAdmin;

routeClient.index(app);
adminRoute.index(app);


//Khởi tạo server (Quan trọng phải có)
app.listen(process.env.PORT, () => {
    console.log(`Đang lắng nghe cổng http://localhost:${process.env.PORT}`);
})