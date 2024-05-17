const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
     
          name : {
            type : String
         },
          
         email : {
            type : String
         },

         password : {
            type : String
         },
         status : {
            type : Number ,
            enum : [1,0] ,
            default : 1
         },
         profileImage : {
            type : String
         },
          contact_no : {
            type : Number
          },                       
         
          Hotel_Id : {
            type : String
          },
          manager_id : {
            type : String
          },
          subAdmin_Id :{
            type : String
          },
          userType : {
                  type : String,
                  enum : ["Super_Admin" , "sub_Admin", "HotelManager"]
          }

}, {timestamps : true}  )

const userModel =  mongoose.model('userModel', userSchema)

module.exports = userModel