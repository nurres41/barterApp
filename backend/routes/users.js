const {User}  = require('../models/user');
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

//Get all users
router.get(`/`, async (req,res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false});
    }

    res.status(200).send(userList);
});

//Get selected user
router.get(`/:id`, async (req,res) => {
    //PasswordHash security nedeniyle eklemiyoruz. 
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){  
        res.status(500).json({message: 'The user with the given ID was not found.'})
    }
    res.status(200).send(user);
});

//Add new user
router.post(`/`, async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    //Return Promise
    user = await user.save();
    
    if(!user)
    return res.status(404).send('The user cannot be created!');
    
    res.send(user);    
});

// User login with jwt
router.post('/login', async(req,res) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    const secret = process.env.SECRET;

    if(!user){
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id,
            },
            secret,
            {expiresIn: '1d'}
        );
        
        return res.status(200).send({user: user.email, token: token});
    } else{
        return res.status(400).send('Password wrong')
    }
});


module.exports = router;