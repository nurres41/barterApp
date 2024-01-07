const { Category } = require('../models/category');
const {Product} = require('../models/product');
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async  (req, res) => {

    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }

    const productList = await Product.find(filter).populate('category');

    if(!productList){
        res.status(501).json({success: false});
    }
    res.send(productList)
});

//Get specific product with id
router.get(`/:id`, async  (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if(!product){
        res.status(501).json({success: false});
    }
    res.send(product)
});

//Add Product
router.post(`/`, async (req, res) => {

    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    product = await Product.save();

    if(!product){
        return res.status(500).send('Cannot be created!')
    }
    res.status(200).json({success:true,message: 'Created!'})
});

//Update product
router.put('/:id', async (req,res) => {

    //If req.body.id not valid object ID just return status
   if(!mongoose.isValidObjectId(req.params.id)){
    return res.status(400).send('Invalid product id');
   }
    //If there is a no valid category cannot update to product
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        {
            new: true
        }
    );

    if(!product)
    return res.status(500).send('The product cannot be updated!');

    res.send(product)
});

//Delete selected product
router.delete('/:id', (req, res)=>{
    Product.findByIdAndDelete(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
});

//All products count
router.get('/get/count', async(req,res) => {
    const productCount = await Product.countDocuments();

    if(!productCount){
        res.status(500).json({success: false})
    }

    res.send({
        productCount: productCount
    });
});

//Feature Product
router.get('/get/featured/:count', async(req,res) => {
    //Sadece limit miktarinda featuredProduct getitir.
    const count = req.params.count ? req.params.count : 0;
    const featuredProduct = await Product.find({isFeatured: true}).limit(+count);

    if(!featuredProduct){
        res.status(500).json({success: false})
    }

    res.send(featuredProduct);
});


module.exports = router;