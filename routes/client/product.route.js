const express=require('express');
const router=express.Router();
const productController=require('../../controllers/client/products.controller')
router.get('/',productController.index);
router.get('/detail/:slug',productController.detail);
router.get('/:slug',productController.category);
module.exports=router;