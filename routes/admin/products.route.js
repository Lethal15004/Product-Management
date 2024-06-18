const express = require('express');
const router=express.Router();
const productsController=require('../../controllers/admin/products.controller');
const productsTrashController=require('../../controllers/admin/products-trash.controller');
//[GET] 1 page
router.get('/',productsController.index);
router.get('/trash',productsTrashController.index)
//[PATCH]
router.patch('/change-single-status', productsController.changeSingleStatus);
router.patch('/changeProducts', productsController.changeProducts);
router.patch('/delete/:id',productsController.deleteProduct)
router.patch('/changePosition/:id/:position',productsController.changePosition)
router.patch('/restore/:id',productsTrashController.restoreProduct)
//[DELETE]
router.delete('/remove/:id',productsTrashController.removeProduct)
module.exports=router;