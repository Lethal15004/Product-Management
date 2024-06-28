module.exports.validation = async (req, res,next) => {
    if(!req.body.title){
        req.flash('error','Vui lòng nhập tiêu đề');
        res.redirect('back');
        return// phải thêm return để dừng hàm
    }
    next(); // chuyển tiếp sang hàm tiếp theo
}