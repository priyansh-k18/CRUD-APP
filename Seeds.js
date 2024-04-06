const Product = require('./models/product');
const mongoose = require('mongoose');

main().catch(err => console.log('Failed Connection!!!'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/store');
      console.log("MONGODB CONNECTION ON!!")
}

// const p = new Product ({
//     name: 'Grape',
//     price: 80,
//     category:'fruit'
// })

// p.save()
//       .then( p => {
//          console.log(p)
//        })
//       .catch(e => {
//          console.log(e)
//        })

const seedProducts = [
    {
        name:'Banana',
        price:50,
        category:'fruit'
    },
    {
        name:'Apple',
        price:120,
        category:'fruit'
    },
    {
        name:'Ladyfinger',
        price:20,
        category:'vegetable'
    },
    {
        name:'Cauliflower',
        price:30,
        category:'vegetable'
    },
    {
        name:'Milk',
        price:50,
        category:'dairy'
    },
    {
        name:'Egg',
        price:8,
        category:'dairy'
    }
]

Product.insertMany(seedProducts)
.then(res =>{
    console.log(res)
})
.catch(e => {
    console.log(e)
})
