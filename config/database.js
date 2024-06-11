const mongoose = require('mongoose'); //Nhúng mongoose vào dự án
module.exports.connect = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (error) {
        console.log(error)
    }
}