const mongoose = require ('mongoose')
const customerSchema = new mongoose.Schema({

        customerName : {
            type : String
        },
        email : {
            type : String
        },
        password : 
        {
            type : String
        },
        status : {
            type : Number,
            enum : [1 ,0],
            default : 1                
        },
        phone_no : 
        {
            type : Number
        },
        profileImage : {
            type : String
        }
}, { timestamps : true })

const customerModel = mongoose.model('customer', customerSchema)

module.exports = customerModel