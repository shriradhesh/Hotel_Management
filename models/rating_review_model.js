const mongoose = require('mongoose')

const rating_review_Schema = new mongoose.Schema({
         
          Hotel_Id : {
              type : String,
          },

           customerId : {
              type : String,
           },
           customer_Name : {
            type : String,
           },
           customer_Image : {
            type : String
           },
           rating : {
            type : Number
           },
           review : {
            type : String
           },

}, {timestamps : true })

const rating_review_Model = mongoose.model('rating_review', rating_review_Schema)

module.exports = rating_review_Model