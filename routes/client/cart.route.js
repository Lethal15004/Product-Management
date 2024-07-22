const express=require('express');
const router=express.Router();

const cartController=require('../../controllers/client/cart.controller');
router.get('/',cartController.index);

router.post('/add/:id',cartController.add);

module.exports=router;