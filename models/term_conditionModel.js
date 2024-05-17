const mongoose = require('mongoose')

const term_conditionSchema = new mongoose.Schema({
          
          Heading : {
            type : String
          },

          Description : {
            type : String,

          },

          Hotel_Id : {
            type : String
          }
},{timestamps : true})

const term_conditionModel = mongoose.model('term_condition', term_conditionSchema)

module.exports = term_conditionModel

