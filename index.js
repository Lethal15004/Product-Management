const express = require('express');//Nhúng express vào dự án
const app = express(); // Khởi tạo ưng dụng web sử dụng express
const port = 1504;

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req,res) =>{
    res.render('client/pages/home/index');
})

app.get('/products', (req,res) =>{
    res.render('client/pages/products/index');
})

app.listen(port, () => {
    console.log(`Đang lắng nghe cổng http://localhost:${port}`);
})