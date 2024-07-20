module.exports = async (req,Products,find,limitItems=4)=>{ // Hàm phân trang
    //Phân trang 
    const pagination={
        currentPage:1,
        limitItems:limitItems,
    };

    if(req.query.page){
        pagination.currentPage=Number(req.query.page);
    }
    pagination.skip=(pagination.currentPage-1)*pagination.limitItems;// Công thức tính skip
    const countProducts= await Products.countDocuments(find);// Đếm tổng số sản phẩm
    pagination.totalPages= Math.ceil(countProducts/pagination.limitItems);// Công thức tính tổng số trang

    return pagination;
}
