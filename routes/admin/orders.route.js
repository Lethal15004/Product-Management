const express=require('express');
const router=express.Router();
const orderController=require('../../controllers/admin/orders.controller');
router.get('/',orderController.index);
router.get('/detail/:id',orderController.detail);
module.exports=router; 