const express = require('express');
const app = express();
//frontendden gelen istegi gosterir.
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');


app.use(cors());
app.options('*', cors());

const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/categories');
const userRouter     = require('./routes/users');

const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use((err, req, res, next) => {
    if(err){
        res.status(500).json({message: err});
    }
})

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);


//Database Connection
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database connectted!')
})
.catch((err) => {
    console.log(err)
});


app.listen(5000, () => console.log(api));