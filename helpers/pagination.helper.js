module.exports = async (req,Products,find)=>{ // Hàm phân trang
    //Phân trang 
    const pagination={
        currentPage:1,
        limitItems:4,
    };

    if(req.query.page){
        pagination.currentPage=Number(req.query.page);
    }
    pagination.skip=(pagination.currentPage-1)*pagination.limitItems;// Công thức tính skip
    const countProducts= await Products.countDocuments(find);// Đếm tổng số sản phẩm
    pagination.totalPages= Math.ceil(countProducts/pagination.limitItems);// Công thức tính tổng số trang

    return pagination;
}
