const mongoose = require('mongoose')

const promo_Coupon_Schema = new mongoose.Schema({
           
    superAdmin_Id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
       
      },
      promo_code : {
            type : String
      },

      discount : {
             type : Number
      },
      start_Date : {
            type : Date
      },
      end_Date : {
        type : Date
      },
      offer_title : {
        type : String
 },
      offer_description : {
     type : String,
 }

}, { timestamps : true })

const promo_Coupon_Model = mongoose.model('promo_and_coupon', promo_Coupon_Schema)

module.exports = promo_Coupon_Model