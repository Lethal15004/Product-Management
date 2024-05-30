const express = require('express') //Nhúng express vào dự án
const app = express() // Khởi tạo ưng dụng web sử dụng express
const port = 1504


app.get('/', (req,res) =>{

})

app.get('/products', (req,res) =>{

})

app.listen(port, () => {
    console.log(`Đang lắng nghe cổng http://localhost:${port}`);
  })