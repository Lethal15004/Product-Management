const express = require('express');//Nhúng express vào dự án
const app = express(); // Khởi tạo ưng dụng web sử dụng express
const path = require('path');//Nhúng path vào dự án
const http = require('http');
const server = http.createServer(app);//Tạo ra một server http
require('dotenv').config()//Nhúng file .env vào dự án
const methodOverride = require('method-override') //Nhúng method-override vào dự án
const flash= require('express-flash');//Nhúng flash vào dự án
const cookieParser = require('cookie-parser');//Nhúng cookie-parser vào dự án
const session = require('express-session');//Nhúng express-session vào dự án

const routeClient=require('./routes/client/index.route');//Nhúng route vào dự án
const adminRoute=require('./routes/admin/index.route');//Nhúng route vào dự án

const systemConfig=require('./config/system');//Nhúng file cấu hình vào dự án\
const database=require('./config/database');//Nhúng file cấu hình database vào dự án
database.connect();//Kết nối database


//Khởi tạo server socket.io
const { Server } = require("socket.io");
const io = new Server(server);// tạo ra một server socket.io

io.on('connection', (socket) => {
    console.log('Có 1 người dùng',socket.id);
})



//Phần flash -> Để hiển thị thông báo (Quan trọng phải có)
app.use(cookieParser('alert-1x2'));
app.use(session(
    {   secret: 'some secret', // Thay thế bằng một khóa bí mật mạnh
        resave: false,
        cookie: { maxAge: 20*60*1000 },
        saveUninitialized:true
    }
));
app.use(flash());

//Phần view engine -> Để render file pug (Quan trọng phải có)
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`));//Định tuyến file tĩnh (Quan trọng phải có)

//Phần body-parser -> Để lấy dữ liệu từ form và fetch (Quan trọng phải có)
const bodyParser = require('body-parser');//Nhúng body-parser vào dự án
const { title } = require('process');
app.use(bodyParser.urlencoded({ extended: false }))//Nhận dữ liệu từ form
app.use(bodyParser.json());//Nhận dữ liệu từ fetch


//Phần method-override -> Để sử dụng PUT và DELETE cho form (Quan trọng phải có)
app.use(methodOverride('_method'))

//Phần tinymce -> Để sử dụng trình soạn thảo tinymce (Quan trọng phải có)
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));



//Local variable -> Chỉ áp dụng cho file pug
app.locals.prefixAdmin=systemConfig.prefixAdmin;

routeClient.index(app);
adminRoute.index(app);


app.get('*',(req,res)=>{
    res.render('client/pages/errors/404',{
        title:'404'
    });
})

//Khởi tạo server (Quan trọng phải có)
server.listen(process.env.PORT, () => {
    console.log(`Đang lắng nghe cổng http://localhost:${process.env.PORT}`);
})