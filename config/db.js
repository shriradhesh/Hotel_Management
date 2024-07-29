/*

const mongoose = require ('mongoose')

mongoose.connect('mongodb+srv://mobappssolutions181:root123@cluster0.ro8e4sn.mongodb.net/aylan_hotel_management',{
        // useNewUrlparser : true ,
        // useUnifiedTopology : true 
})

const db = mongoose.connection

db.on('error', ()=>{
     console.log('error while connecting to momgodb');
})
db.once('open', ()=>{
     console.log('connected to mongodb');
})

*/




const mongoose = require('mongoose');

const dbUrl = process.env.mongo_db ;
mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = db;
