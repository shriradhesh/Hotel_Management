const mongoose = require('mongoose')
const contactUs_Schema = new mongoose.Schema({

       Name  : {
         type : String
       },
       email : {
          type : String
       },
       message : {
          type : String
       }
}, { timestamps : true })

const contact_usModel = mongoose.model('contact_us' , contactUs_Schema)

module.exports = contact_usModel
