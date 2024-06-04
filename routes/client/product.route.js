const express=require('express');
const router=express.Router();

router.get('/', (req,res) =>{
    res.render('client/pages/products/index');
})

router.get('/products/detail', (req,res) =>{
    res.render('client/pages/products/detail');
})

router.post('/products/create', (req,res) =>{
    res.render('client/pages/products/create');
})

router.put('/products/update', (req,res) =>{
    res.render('client/pages/products/update');
})

module.exports=router;