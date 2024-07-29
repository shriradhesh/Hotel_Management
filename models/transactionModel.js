const mongoose = require ('mongoose');
const transactionSchema = new mongoose.Schema({

       bookingId : {
        type : String,
        required : true ,
       
       },
       transaction_Id : {
        type : String,
        // required : true,
       },
       Hotel_Id : {
          type : String
       },
       amount : {
        type : Number,
       
       },
       payment_status: {
        type: String,      
         },   
  
      payment_key : {
        type : Number
      },     
      promoCode : {
        type : String
   },
     discount_price : {
        type : Number
   }


} , { timestamps : true })
const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
