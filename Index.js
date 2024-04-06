const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

class AppError extends Error {
    constructor(message, status){
        super();
        this.message = message;
        this.status = status;
    }
}


const Product = require('./models/product');

main().catch(err => console.log('Failed Connection!!!'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/store');
      console.log("MONGODB CONNECTION ON!!")
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))


//FARM ROUTES





//PRODUCT ROUTES

const categories = ['fruit','vegetable','dairy']

function wrapAsync(fn){
    return function (req,res,next){
        fn(req,res,next).catch(e => next(e))
    }
}

app.get('/products' , wrapAsync(async(req, res, next) => {
     const {category} = req.query;
        if(category){
            const products = await Product.find({category})
            res.render('products/index',{products,category})
        }
        else{
            const products = await Product.find({})
            res.render('products/index',{products, category:"ALL"})
        }
}))

app.get('/products/new', (req,res) =>{
    res.render('products/new',{categories})
})


app.post('/products',wrapAsync(async(req,res,next) =>{

        const newProduct = new Product(req.body);
         await newProduct.save();
        res.redirect(`/products/${newProduct._id}`)
    
}))


app.get('/products/:id' , wrapAsync(async(req,res,next) => {
        const {id} = req.params;
        const product = await Product.findById(id)
        if(!product){
          throw new AppError('Product Not Found',404);
        }
        else{
          res.render('products/show',{product})
        }
}))

app.get('/products/:id/edit', wrapAsync(async(req,res,next) =>{

        const {id} = req.params;
        const product = await Product.findById(id);
        res.render('products/edit',{product,categories})
}))

app.put('/products/:id' , wrapAsync(async(req,res,next) =>{
    
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body,{runValidators:true, new: true})
        res.redirect(`/products/${product._id}`);
    
}))

app.delete('/products/:id', wrapAsync(async(req,res)=>{
    
        const {id} = req.params;
       await Product.findByIdAndDelete(id);
       res.redirect('/products');
}))

const handleValidationErr = err =>{
     console.dir(err);
     return new AppError(`Validation Failed...${err.message}`, 400)
}

app.use((err,req,res,next) => {
    console.log(err.name);
    if(err.name === 'validationError') err = handleValidationErr(err)
    next(err);
})

app.use((err,req,res,next) => {
    const {status = 500, message='Something went wrong'} = err;
    res.status(status).send(message);
})



app.listen(3000, () => {
    console.log("Listening On Port 3000")
})
