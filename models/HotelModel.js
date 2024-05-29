const mongoose = require('mongoose')

const HotelSchema = new mongoose.Schema({
            Hotel_Id : {
                  type : String
            },
            Hotel_name : {
            type : String
           },
           address : {
              type : String
           },
           aboutHotel : {
                   type : String
           },
           city : {
            type : String,
           },
           manager_id :{
            type : String
           },
           HotelImages : {
               type : [String]
           },
           hotelType: {
            type: String
        },
        commision_rate : {
          type : Number
        },            

        roomPricesByType : {
          type : String
        },
           status : {
            type : Number,
            enum : [0 ,1],
            default : 1
           },

           facilities: [
            {
              facilityType: {
                type: String,                
              },              
            }
          ],
           
        ratings : {
          type : Number
        },
            review : {
              type : String
            },

            
           floors : [{
                  floor_Number : {
                      type : Number
                  },
                   rooms : [{
                             room_number : {
                                    type: String
                                      },

                             type:    { 
                                   type: String
                                      },

                            description: { 
                                    type: String 
                                      },

                            capacity: { 
                                  type: Number,
                                     },
                                     
                             price: { type: Number,
                                    },   
                              status : {
                                    type : Number,
                                    enum : [1 ,0],
                                    default : 1                   // 1 for active , 0 for inactive
                              },
                              available: {
                                type: Boolean,
                                default: true
                            },                      
                          
                            }]
           }],

         
      

      
         
}, { timestamps : true })


const HotelModel = mongoose.model('Hotel', HotelSchema)


module.exports = HotelModel