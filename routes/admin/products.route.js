const express = require('express');
const router=express.Router();

//multer để nhúng file ảnh vào form
const multer=require('multer');
//const upload = multer({ dest: './public/admin/uploads'});

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/admin/uploads');//Đường dẫn khác so với các đường dẫn đã học
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`);
    }

})

const upload=multer({storage:storage});

const productsController=require('../../controllers/admin/products.controller');
const productsTrashController=require('../../controllers/admin/products-trash.controller');
//[GET] 1 page
router.get('/',productsController.index);//page list all products
router.get('/trash',productsTrashController.index);//page list all products in trash
router.get('/create',productsController.create);//page create a product
//[PATCH]
router.patch('/change-single-status', productsController.changeSingleStatus);//change status of a single product
router.patch('/changeProducts', productsController.changeProducts);//change status of multiple products
router.patch('/delete/:id',productsController.deleteProduct)//delete a product
router.patch('/changePosition/:id/:position',productsController.changePosition)//change position of a product
router.patch('/restore/:id',productsTrashController.restoreProduct)//restore a product

//[DELETE]
router.delete('/remove/:id',productsTrashController.removeProduct)//remove permanent a product


//[POST]
router.post('/create',upload.single("thumbnail"),productsController.createProduct)//create a product;

module.exports=router;