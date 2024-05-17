const mongoose = require('mongoose');

const customerNotificationSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerModel',
      
    },
      superAdmin_Id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
       
      },
      customerIds : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerModel',
     }],
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

        customerEmail : {
            type : String
        },
        customerName : {
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

const customer_NotificationModel = mongoose.model('customer_Notification', customerNotificationSchema);

module.exports = customer_NotificationModel;