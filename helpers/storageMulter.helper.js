const multer=require('multer');
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/admin/uploads');//Đường dẫn khác so với các đường dẫn đã học
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`);
    }
})
module.exports=storage;