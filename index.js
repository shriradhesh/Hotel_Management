const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const port = process.env.PORT || 2500
const cors = require('cors')
const customerRouter = require('./router/customerRouter')
const superAdminRouter = require('./router/superAdminRouter')
const HotelManagerRouter = require('./router/HotelmanagerRouter')


const paypal = require('./paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// database configuration
  const db = require('./config/db')
// Middleware configuration
    
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use(express.static('uploads'))



                                  /*  PayPal configuration */

                    

                                   
               

                              


// Api for Router configuration

     app.use('/api', customerRouter)
     app.use('/api', superAdminRouter)
     app.use('/api', HotelManagerRouter)

app.use((req, res, next) => {
res.header('Access-Control-Allow-Origin', 'http://localhost:2501/api/'); 
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
next();
});
      



app.get('/', (req ,res) =>{
    res.send('Hello')
})

 app.listen(port , ()=>{
    console.log(`server is running at port ${port}`);
 })