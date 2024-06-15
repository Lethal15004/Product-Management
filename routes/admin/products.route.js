const express = require('express');
const router=express.Router();
const productsController=require('../../controllers/admin/products.controller');
router.get('/',productsController.index);
router.patch('/change-single-status', productsController.changeSingleStatus);
router.patch('/change-multiple-status', productsController.changeMultipleStatus);
module.exports=router;