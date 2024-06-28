const express = require('express');
const router=express.Router();

//multer để nhúng file ảnh vào form
const multer=require('multer');
    //const upload = multer({ dest: './public/admin/uploads'});
const storage=require('../../helpers/storageMulter.helper');
const upload=multer({storage:storage});

//Products controller
const productsController=require('../../controllers/admin/products.controller');
const productsTrashController=require('../../controllers/admin/products-trash.controller');


//Product validations
const productValidation=require('../../validations/admin/product.validation');

//[GET] 1 page
router.get('/',productsController.index);//page list all products
router.get('/trash',productsTrashController.index);//page list all products in trash
router.get('/create',productsController.create);//page create a product
router.get('/pageChangeProduct/:id',productsController.pageChangeProduct);//page change a product
//[PATCH]
router.patch('/change-single-status', productsController.changeSingleStatus);//change status of a single product
router.patch('/changeProducts', productsController.changeProducts);//change status of multiple products
router.patch('/delete/:id',productsController.deleteProduct)//delete a product
router.patch('/changePosition/:id/:position',productsController.changePosition)//change position of a product
router.patch('/restore/:id',productsTrashController.restoreProduct)//restore a product

//[DELETE]
router.delete('/remove/:id',productsTrashController.removeProduct)//remove permanent a product


//[POST]
router.post('/create',upload.single("thumbnail"),productValidation.validation,productsController.createProduct)//validation and create a product;

module.exports=router;