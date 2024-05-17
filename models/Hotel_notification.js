const mongoose = require('mongoose');

const HotelNotificationSchema = new mongoose.Schema({

    manager_Id: {
       type : String
      
    },

      superAdmin_Id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
       
      },

        Hotel_Id : {
            type : String
        },  

        date: {
            type: Date,  
        },

        title :
        {
        type : String
        },

        message :
        {
        type : String
        },

        managerEmail : {
            type : String
        },
        managerName : {
            type : String
        },
        
        status : {
            type : Number,
            enum : [0 , 1],
            default  : 1
        }

},{
  timestamps: true,
});

const Hotel_NotificationModel = mongoose.model('Hotel_Notification', HotelNotificationSchema);

module.exports = Hotel_NotificationModel;