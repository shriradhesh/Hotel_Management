const mongoose = require('mongoose')
const complainSchema = new mongoose.Schema({

    Booking_Id :{
        type :String
    },
    guest_name :{
          type : String
    }, 
     email : {
        type : String
     } ,
      phone : {
        type : Number
      } , 
      roomNumber :{
          type : String
      } ,
       complain_type : {
        type : String,
        enum : ['Room Cleanliness', 'Noise Disturbance' , 'Service Quality' , 'Room Facilities' , 'Safety Concerns' , 'others']
       },

       status : {
        type : Number,
        enum : [1,0],
        Default : 1
       },
       
        description : {
            type : String,

        }
}, { timestamps : true})

const complainModel = mongoose.model('complain', complainSchema)

module.exports = complainModel