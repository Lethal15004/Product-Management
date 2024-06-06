const mongoose = require('mongoose'); //Nhúng mongoose vào dự án
module.exports.connect = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Kết nối thành công tới database")
    } catch (error) {
        console.log("Kết nối thất bại tới database")
        log(error)
    }
}