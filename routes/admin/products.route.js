const express = require('express');
const router=express.Router();
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
router.post('/create',productsController.createProduct)//create a product;

module.exports=router;