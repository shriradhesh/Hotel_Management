const mongoose = require ('mongoose');
const transactionSchema = new mongoose.Schema({

       bookingId : {
        type : String,
        required : true ,
        unique : true
       },
       transaction_Id : {
        type : String,
        // required : true,
       },
       amount : {
        type : Number,
       
       },
       payment_status: {
        type: String,       
        
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
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


})
const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;
