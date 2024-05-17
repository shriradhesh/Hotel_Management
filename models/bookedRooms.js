const mongoose = require('mongoose');

const bookedRoomSchema = new mongoose.Schema({
    Hotel_Id: {
        type: String,
        required: true
    },
    Booking_Id : {
        type : String
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customerModel',
        required: true
    },
    customer_email : {
        type : String
    },
    Hotel_name : {
        type : String
    },
    number_of_Rooms : {
        type : Number
    },
    room_fare : {
        type : Number
    },
    status : {
        type : String,
            enum :['confirmed' , 'pending', 'cancelled'],
          
    },
    roomType : {
        type : String
    },
    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },
    bookedRoom: [{
        floorNumber: {
            type: Number,
            required: true
        },
        rooms: [{
            roomNumber: {
                type: String,
                required: true
            },
            available: {
                type: Boolean,
                default: false 
            },
            price : {
                type : Number
            },
            roomType : {
                type : String
            },
           
        }]
    }],
    
    guests: [{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        }
    }],
    totalguests : {
        type: Number
    },
    promoCode : {
        type : String
    }
}, { timestamps: true });

const bookedRoomModel = mongoose.model('bookedRoom', bookedRoomSchema);

module.exports = bookedRoomModel;
