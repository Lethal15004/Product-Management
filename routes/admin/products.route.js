const express = require('express');
const router=express.Router();
const productsController=require('../../controllers/admin/products.controller');
router.get('/',productsController.index);
router.patch('/change-single-status', productsController.changeSingleStatus);
router.patch('/change-multiple-status', productsController.changeMultipleAnDeleteProducts);
router.patch('/delete/:id',productsController.deleteProduct)
router.patch('/changePosition/:id/:position',productsController.changePosition)

//Thêm phần 
module.exports=router;