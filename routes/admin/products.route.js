const express = require('express');
const router=express.Router();
const productsController=require('../../controllers/admin/products.controller');
router.get('/',productsController);
module.exports=router;