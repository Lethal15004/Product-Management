const express=require('express');
const router=express.Router();
const orderController=require('../../controllers/admin/orders.controller');
router.get('/',orderController.index);
router.get('/detail/:id',orderController.detail);
router.patch('/accept/:id',orderController.accept);
router.patch('/cancel/:id',orderController.cancel);
module.exports=router; 