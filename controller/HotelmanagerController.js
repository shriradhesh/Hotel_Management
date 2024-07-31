const express = require('express')
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel')
const HotelModel = require('../models/HotelModel');
const bookedRoomModel = require('../models/bookedRooms');
const sendBookingEmail = require('../utils/sendBookingEmail')
const privacy_policyModel = require('../models/privacy_policyModel');
const term_conditionSchema = require('../models/term_conditionModel');
const term_conditionModel = require('../models/term_conditionModel');
const complainModel = require('../models/complainModel')
const ExcelJs = require('exceljs');
const rating_review_Model = require('../models/rating_review_model');
const Hotel_NotificationModel = require('../models/Hotel_notification');
const customer_NotificationModel = require('../models/customerNotification')
const customerModel = require('../models/customerModel')
const notificationEmail = require('../utils/NotificationEmail');
const TransactionModel = require('../models/transactionModel');
 
                                 

  
                                                 /* Hotel Manager Section */

      // APi for get Hotel managers Hotel

             const get_Hotels_of_HotelManager  = async( req ,res)=>{
                   try {
                         const manager_id = req.params.manager_id
                        // check for manager_id
                        if(!manager_id)
                        {
                            return res.status(400).json({
                                  success : false , 
                                  message : 'manager_id required'
                            })
                        }

                        // check for Hotel Manager 's Hotel
                    
                        const Hotel_manager_Hotel = await HotelModel.find({manager_id : manager_id })
                        if(!Hotel_manager_Hotel)
                        {
                            return res.status(400).json({
                                   success : false , 
                                   message : 'no Hotel found for the manager'
                            })
                        }

                          return res.status(200).json({
                               success : true , 
                               message : 'Hotel Details',
                               Hotel_Details  : Hotel_manager_Hotel
                          })
                   } catch (error) {
                    return res.status(500).json({
                           success : false , 
                           message : 'server error', 
                           error_message : error.message
                    })
                   }
             }


                                               /* Hotel Section */

          
// APi for update particular room details
const updateRoom = async (req, res) => {
    try {
        const { Hotel_Id, room_number } = req.params;
        const { description, price , capacity } = req.body;

        // Check for Hotel_Id
        if (!Hotel_Id) {
            return res.status(400).json({
                success: false,
                message: 'Hotel ID required'
            });
        }

        // Check for room_number
        if (!room_number) {
            return res.status(400).json({
                success: false,
                message: 'Room number is required'
            });
        }

        // Check for Hotel
        let hotel = await HotelModel.findOne({ Hotel_Id });

        if (!hotel) {
            return res.status(400).json({
                success: false,
                message: 'Hotel not found'
            });
        }

        // Find the room based on room_number
        let foundRoom = null;
        for (const floor of hotel.floors) {
            const roomIndex = floor.rooms.findIndex(room => room.room_number === room_number);
            if (roomIndex !== -1) {
                foundRoom = floor.rooms[roomIndex];
                break;
            }
        }

        // If room doesn't exist, return error
        if (!foundRoom) {
            return res.status(400).json({
                success: false,
                message: `Room ${room_number} not found in Hotel ${Hotel_Id}`
            });
        }

        // Update the description and price if provided
        if (description) {
            foundRoom.description = description;asn
        }

        if (price) {
            foundRoom.price = price;
        }
        if (capacity) {
            foundRoom.capacity = capacity;
        }

        await hotel.save();

        return res.status(200).json({
            success: true,
            message: `Room details updated successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};



        // APi for active inactive Rooms of Hotel

        const active_inactive_Room = async (req, res) => {

            const { Hotel_Id, room_number } = req.params;
        
            // Check for required fields
            if (!Hotel_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel_Id required'
                });
            }
        
            if (!room_number) {
                return res.status(400).json({
                    success: false,
                    message: 'room_Number required'
                });
            }
        
            try {
                // Check for Hotel existence
                const exist_Hotel = await HotelModel.findOne({ Hotel_Id: Hotel_Id });
                if (!exist_Hotel) {
                    return res.status(400).json({
                        success: false,
                        message: 'No Hotel Found'
                    });
                }
        
                // Extract Room array from the floor of the hotel 
                const floor = exist_Hotel.floors.find(floor => {
                    return floor.rooms.some(room => room.room_number === room_number);
                });
        
                if (!floor) {
                    return res.status(400).json({
                        success: false,
                        message: 'Rooms not found in any floor'
                    });
                }
        
                const room = floor.rooms.find(room => room.room_number === room_number);
        
                if (!room) {
                    return res.status(400).json({
                        success: false,
                        message: 'Room not found'
                    });
                }

                  // Toggle Hotel room status
                  let newStatus = room.status === 1 ? 0 : 1;
                    
                  room.status = newStatus                
          
                            // Save the updated room status
                    await exist_Hotel.save();

                    return res.status(200).json({
                        success: true,
                        message: `Room ${newStatus ? 'activated' : 'inactivated'} successfully`
                    });                    
        
              
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error'
                });
            }
        };
                                                 /* Booking Section */
        


// Api for get ALL pending requests for booking

   const getAll_pending_Booking_Request = async( req , res)=>{
                            // check for pending requests for booking 
                    const bookedRooms_request = await bookedRoomModel.find({
                        status : 'pending',
                    })
                     if(!bookedRooms_request)
                     {
                        return res.status(400).json({
                                success : false , 
                                message  : 'no pending Booking request found'
                        })
                     }
                     else
                     {
                        return res.status(200).json({
                              success : true , 
                              message : 'all Booking Pending requests',
                              Details : bookedRooms_request
                        })
                     }
   }
       
   
      // Api for get Available Rooms by Floors wise of the hotel
           
      const getHotelRoom_for_pending_bookings = async (req, res) => {
        try {
            const { Hotel_Id } = req.params;
    
            // Check for Hotel_Id
            if (!Hotel_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel Id required'
                });
            }
    
            // Check for Hotel existence
            const hotels = await HotelModel.find({ Hotel_Id: Hotel_Id });
            if (!hotels || hotels.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel not found'
                });
            }
    
            let availableRooms_floorwise = [];
    
            // Get pending bookings
            const pendingBookings = await bookedRoomModel.find({
                Hotel_Id: hotels[0].Hotel_Id, 
                status: 'pending'
            });
    
            // Loop through each pending booking
            for (const booking of pendingBookings) {
                
                // Access check-in and check-out dates of the pending booking
                const checkIn = booking.checkIn;
                const checkOut = booking.checkOut;
    
                // Loop through each hotel to calculate availability
                for (let hotel of hotels) {
                    let availableRooms = [];
                    let bookedRooms = [];
                    // Retrieve available rooms details
                    for (let floor of hotel.floors) {
                        for (let room of floor.rooms) {
                            availableRooms.push({
                                roomNumber: room.room_number,
                                roomType: room.type,
                                floor: floor.floor_Number ,
                                capacity : room.capacity,
                                price : room.price
                            });
                        }
                    }
    
                    // Retrieve booked rooms details
                    const bookedRoomsData = await bookedRoomModel.find({
                        Hotel_Id: hotel.Hotel_Id,
                        checkIn: { $lte: checkOut },
                        checkOut: { $gte: checkIn },
                        $or: [
                            { status: "confirmed" },
                        ],
                    });
    
                        // Retive bookedRoom details
                        for ( let b1 of bookedRoomsData)
                        {
                            for ( let b2 of b1.bookedRoom)
                            {
                                for ( let b3 of b2.rooms)
                                {
                                    bookedRooms.push({
                                         roomNumber : b3.roomNumber,
                                         roomType : b3.roomType,
                                         price : b3.price,
                                         floor : b2.floorNumber
                                    })
                                }
                            }
                        }
                            // Filter availableRooms based on bookedRooms
                    availableRooms = availableRooms.filter(availableRoom => {
                        return !bookedRooms.some(bookedRoom => bookedRoom.roomNumber === availableRoom.roomNumber);
                    });
    
                    availableRooms_floorwise.push({
                       
                            hotelName: hotel.name,
                            availableRooms: availableRooms,  
                            bookedRooms: bookedRooms                          
                       
                    });
                   
                }
                break
            }
    
            return res.status(200).json({
                success: true,
                message: "Available rooms",
                availableRooms_floorwise: availableRooms_floorwise
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error",
                error_message: error.message
            });
        }
    };    
    
    
    // Api for assign room to the pending booking
    const assingRoom_to_booking = async (req, res) => {
        try {
            const booking_Id = req.params.booking_Id;
            const { floorNumber, room } = req.body;
    
            // Check for required fields
            if (!booking_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Booking Id required'
                });
            }

            if (typeof floorNumber !== 'number' || floorNumber < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid floorNumber required'
                });
            }
            if (!room) {
                return res.status(400).json({
                    success: false,
                    message: 'Room details required'
                });
            }
    
            // Check for booking
            const booking = await bookedRoomModel.findOne({
                Booking_Id: booking_Id,
                status: 'pending'
            });
            
              // check for hotel
              const Hotel = await HotelModel.findOne({ Hotel_Id : booking.Hotel_Id })
               // check for Hotel manager
               const hotel_manager = await userModel.findOne({ manager_id : Hotel.manager_id })
               // check for transaction
                const transaction = await TransactionModel.findOne({ bookingId : booking_Id })
                   
                   let payment_method = ''
                     if(transaction.payment_key === 1)
                     {
                          payment_method = 'Stripe'
                     }
                     else if( transaction.payment_key === 2)
                     {
                        payment_method = 'paypal'
                     }
                     else
                     {
                         payment_method = 'Cash'
                     }
               
    
            if (!booking) {
                return res.status(400).json({
                    success: false,
                    message: `You already assign Room to Booking : ${booking_Id} or booking not found`
                });
            }
                    
                    const Number_of_guests = booking.guests.length
                    const discount_price = transaction.discount_price
                    const paid_amount = transaction.amount


            // Ensure only one floor is added
            if (booking.bookedRoom.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'A floor is already added to the booking'
                });
            }
    
            // Validate room number based on floorNumber
            const startingRoomNumber = floorNumber * 100 + 1;
            const roomNumber = parseInt(room.roomNumber);
            if (roomNumber < startingRoomNumber || roomNumber >= startingRoomNumber + 100) {
                return res.status(400).json({
                    success: false,
                    message: `Room number ${roomNumber} does not match the room number series for floor number ${floorNumber}`
                });
            }
    
            // Add floor and room to the bookedRoom array
            booking.bookedRoom.push({ floorNumber, rooms: [room] });

             booking.status = 'confirmed'
            // Update the booking document with the modified floors
            await booking.save();

            const bookingContent = `
                <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking Receipt and Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: fff;
        }

        .container {
            width: 80%;
            margin: 20px auto;
            padding: 20px;
            background-color: rgba(250, 235, 215, 0.268);
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            padding: 3px 0;
        }

        .header img {
            max-width: 100px;
        }

        .header h3 {
            margin: 5px 0;
            font-size: 24px;
        }

        .invoice-info,
        .guest-info,
        .booking-info,
        .payment-info {
            margin-bottom: 0px;
        }

        .invoice-info h3,
        .guest-info h3,
        .booking-info h3,
        .payment-info h3 {
            margin-bottom: 4px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0px;
        }

        .invoice-info p,
        .guest-info p,
        .booking-info p,
        .payment-info p {
            margin: 5px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        table,
        th,
        td {
            border: 1px solid #ddd;
        }

        th,
        td {
            padding: 10px;
            text-align: left;
        }

        thead tr:first-child th {
            background: #a8a6a6;
        }

        .footer p {
            margin: 10px 0;
            font-size: 12px;
            color: #666;
        }

        .logo {
            width: 50px;
            height: 50px;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
           
            <h3>Hotel Booking Reciept</h3>
            <p> ${booking.Hotel_name}</p>
            <p>Hotel Address : ${Hotel.address} </p>
            <p>Phone: ${hotel_manager.contact_no} | Email: ${hotel_manager.email}</p>
        </div>

        <div class="invoice-info">
            <h3>Booking</h3>
            <p>Booking Id : ${booking_Id}</p>
            <p>Booking Date: ${booking.createdAt}</p>
        </div>
        
       
            <div class="booking-info">
                <h3>Booking Information</h3>
                <p>Check-in Date: ${booking.checkIn}</p>
                <p>Check-out Date: ${booking.checkOut}</p>
                <p>Room Type: ${booking.roomType}</p>               
                <p>Number of Guests: ${Number_of_guests}</p>
            </div>
      
        <div class="payment-info">
           
                    <h3>Payment Information</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Number of Guests</th> 
                                <th>Total Discount</th>
                                <th>Total Amount paid</th>
                                 
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Ticket Details </td>
                                <td>${Number_of_guests}</td>
                                <td>${discount_price}</td>
                                <td>${paid_amount}</td>
                            </tr>
                            <tr>
                                <td>Service Charges</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>Taxes</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="3">Total Amount</th>
                                <th>${paid_amount}</th>
                            </tr>
                        </tfoot>
                    </table>                  
                <div class="booking-info">
                <h3>Transaction Information</h3>
                <p>Payment Method : ${payment_method}</p>
                <p> payment Status : ${transaction.payment_status}</p>
                <p>Transaction Id : ${transaction.transaction_Id}</p>               
               
            </div>
                
           
        </div>
        <div class="footer">
            <p>Thank you for choosing our service <strong> Aylan.com </strong>  We look forward to serving you again!</p>
        </div>
    </div>
</body>

</html>        `;


             

            sendBookingEmail(booking.customer_email, `Hotel Booking ..!`, bookingContent);
                  // Save a single record in UsersNotificationModel
                  const savedNotification = await customer_NotificationModel.create({
                    customerId: booking.customerId,
                    title : "Booking Confirmation",
                    message : `Congratulations your Booking has been confirmed for the hotel : ${booking.Hotel_name}`,        
                    customerEmail: booking.customer_email,
                    status : 1            
                });

                await savedNotification.save()

            return res.status(200).json({
                success: true,
                message: `Room assigned successfully to the booking ${booking_Id}`
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server Error',
                error_message: error.message
            });
        }
    };
    


    // Api for get all Bookings
    const getAllBookings_of_Hotel = async (req, res) => {
        try {
            const Hotel_Id = req.params.Hotel_Id;
    
            // Check for required Fields
            if (!Hotel_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel Id Required'
                });
            }
    
            // Check for Hotel existence
            const exist_Hotel = await HotelModel.findOne({ Hotel_Id: Hotel_Id });
            if (!exist_Hotel) {
                return res.status(400).json({
                    success: false,
                    message: 'No Hotel found'
                });
            }
    
            // Retrieve Hotel bookings
            const hotel_bookings = await bookedRoomModel.find({ Hotel_Id: Hotel_Id });
    
            if (!hotel_bookings || hotel_bookings.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No bookings done yet for this Hotel'
                });
            }
    
            // Sort Hotel bookings by check-in date in descending order
            const sorted_HotelBookings = hotel_bookings.sort((a, b) => {
               
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    
            return res.status(200).json({
                success: true,
                message: 'Hotel bookings',
                bookings: sorted_HotelBookings
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    
    
    // Api for search particular booking by bookingId
             const searchBooking = async( req ,res)=>{
                try {
                      const booking_Id = req.params.booking_Id
                      // check for booking ID
                      if(!booking_Id)
                      {
                        return res.status(400).json({
                                success : false , 
                                message : 'booking Id required'
                        })
                      }
                      // check for booking
                      const booking = await bookedRoomModel.findOne({
                              Booking_Id : booking_Id
                      })
                      if(!booking)
                      {
                        return res.status(400).json({
                                success : false , 
                                message : 'no booking found'
                        })
                      }

                      return res.status(200).json({
                          success : true , 
                          message : 'booking Details',
                          booking_Details : booking
                      })
                } catch (error) {
                    return res.status(500).json({
                         success : false , 
                         message : 'server error',
                         error_message : error.message
                    })
                }
             }
    
    
                                          /*  Hotel privacy and policy */

    // Api for privacy and policy
    const privacyAndPolicy = async (req ,res)=>{
         const Hotel_Id = req.params.Hotel_Id
        const { Heading , Description   } = req.body
        try {
            // check if there is an existing privacy and policy
       const existingPrivacy_and_policy = await privacy_policyModel.findOne({
        Hotel_Id : Hotel_Id
       })

       if(existingPrivacy_and_policy)
       {
        existingPrivacy_and_policy.Heading = Heading
        existingPrivacy_and_policy.Description = Description
       
        
        await existingPrivacy_and_policy.save()

        return res.status(200).json({
                                     success : true ,
                                    UpdateMessage : 'Privacy and Policy updated successfully',
                                    
        })
       }
       else
       {
            if(!Heading)
            {
                return res.status(400).json({
                       success : false , 
                        message : 'Heading Required'
                })
            }
            if(!Description)
            {
                return res.status(400).json({
                       success : false , 
                        message : 'Description Required'
                })
            }
            const newPrivacy_and_policy = new privacy_policyModel({
                Heading : Heading,
                Description : Description,
                Hotel_Id : Hotel_Id,
               
            })

               await newPrivacy_and_policy.save()

              return res.status(200).json({
                                   success : true ,
                                   createdmessage : 'Privacy and Policy created Successfully',                             

              })
       }

        } catch (error) {
            return res.status(500).json({
                               success : false ,
                               serverErrorMessage : 'Server Error'
            })
        }
       }                       
       
    // Api for get Privacy and policy of particular hotel
       const getPrivacy_policy = async(req ,res)=>{
        try {
                const Hotel_Id = req.params.Hotel_Id
                // check for Hotel_Id
                if(!Hotel_Id)
                {
                    return res.status(400).json({
                         success : false , 
                         message : 'Hotel_Id required'
                    })
                }

                // check for Hotel privacy policy

             const check_privacy_policy = await privacy_policyModel.findOne({
                   Hotel_Id : Hotel_Id
             })

             if(!check_privacy_policy)
             {
                return res.status(400).json({
                     success : false , 
                     message : 'no privacy policy found for the Hotel'
                })
             }
             return res.status(200).json({
                    success : true ,
                    message : 'privacy & policy of Hotel',
                    Details : check_privacy_policy
             })
        } catch (error) {
              return res.status(500).json({
                  success : false , 
                  message : 'server error',
                  error_message : error.message
              })
        }
       }


                                                      /* Term & Condition section */
            
            // APi for term and Condition
        const term_condition = async( req , res)=>{
            try {
                  const Hotel_Id = req.params.Hotel_Id
                const {
                    Heading , Description
                } = req.body
                
                // check for Hotel_Id
                
                if(!Hotel_Id)
                {
                    return res.status(400).json({
                         success : false , 
                         message  : 'Hotel_Id required',

                    })
                }

                // check for existing hotel term condition
                const exist_t_d = await term_conditionModel.findOne({
                        Hotel_Id : Hotel_Id
                })

                if(exist_t_d)
                {
                        exist_t_d.Heading = Heading
                        exist_t_d.Description = Description
                        await exist_t_d.save()

                        return res.status(200).json({
                             success : true , 
                             message : 'term & Condition updated successfully ..!'
                        })
                        
                }
                 else
                 {
                    if(!Heading)
                    {
                        return res.status(400).json({
                               success : false , 
                                message : 'Heading Required'
                        })
                    }
                    if(!Description)
                    {
                        return res.status(400).json({
                               success : false , 
                                message : 'Description Required'
                        })
                    }
                      const newData = new term_conditionModel({

                             Heading : Heading,
                             Description : Description,
                             Hotel_Id : Hotel_Id                             
                      })

                       await newData.save()

                       return res.status(200).json({
                                success : true , 
                                message : 'term & condition created successfully ..!',
                                Details : newData
                       })
                 }

            } catch (error) {
                return res.status(500).json({
                     success : false , 
                     message : 'server error',
                     error_message : error.message
              })
            }
        }


    // Api for get particular Hotel Term & condition
       const getHotel_term_condition = async( req , res)=>{
          try {
                const Hotel_Id = req.params.Hotel_Id
                // check for Hotel_Id
                if(!Hotel_Id)
                {
                    return res.status(400).json({
                         success : false , 
                         message  : 'Hotel_Id required'
                    })
                }

                // check for term & condition
                const check_term_condition = await term_conditionModel.findOne({
                            Hotel_Id : Hotel_Id
                })
                if(!check_term_condition)
                {
                    return res.status(400).json({
                           success : false , 
                           message : 'no term & condition for Hotel'
                    })
                }

                  return res.status(200).json({
                        success : true , 
                        message : 'Hotel term & Condition',
                        Details : check_term_condition
                  })
          } catch (error) {
               return res.status(500).json({
                     success : false , 
                     message : 'server error',

               })
          }
       }


                                          /* Complain Section */
    // Api for get all complains 
             const getAllComplains = async( req , res)=>{
                 try {
                        // check for all complains
                    const allComplains = await complainModel.find({ })
                    if(!allComplains)
                    {
                        return res.status(400).json({
                              success : false ,
                              message : 'no complains Registered Yet ..'
                        })
                    }
                      return res.status(200).json({
                         success : true ,
                         message : 'all Complains',
                         Details : allComplains
                      })
                 } catch (error) {
                    return res.status(500).json({
                          success : false , 
                          message : 'server error'
                    })
                 }
             }
                 

                                       /* Hotel Rating & Review Section */

        // Api for get particular Hotel Rating Reviews
          const getRating_Reviews = async( req , res)=>{
            try {
                    const Hotel_Id = req.params.Hotel_Id

                // check for Hotel_Id
                if(!Hotel_Id)
                {
                    return res.status(400).json({
                          success : false , 
                          message : "Hotel_Id required"
                    })
                }

                 // check for hotel Existance
                 const exist_Hotel = await HotelModel.findOne({
                      Hotel_Id : Hotel_Id
                 })

                 if(!exist_Hotel)
                 {
                    return res.status(400).json({
                         success : false ,
                         message : 'No Hotel found'
                    })
                 }

                 // get all customers Ratings and Reviews for the Hotel
                
                 const allRR = await rating_review_Model.find({
                         Hotel_Id : Hotel_Id
                 })
                 if(!allRR)
                 {
                    return res.status(400).json({
                          success : false , 
                          message : 'no Review & Rating Done yet for the Hotel'
                    })
                 }

                 return res.status(200).json({
                         success : true ,
                         message : 'all Reviews & Ratings of the Hotels ',
                         Deatils : allRR
                 })

            } catch (error) {
                return res.status(500).json({
                      success : false , 
                      message : 'server error',
                      error_message : error.message
                })
            }
          }
           

                                             /* Notification section */

    
        const getHotel_notificaition = async( req , res)=>{
            try {
                   const Hotel_Id = req.params.Hotel_Id
                   // check for Hotel_Id
                if(!Hotel_Id)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'Hotel_Id required'
                    })
                }

                  // check for notifcations of hotel
                  const Hotel_notification = await Hotel_NotificationModel.find({
                             Hotel_Id : Hotel_Id,
                             status : 1
                   })

                  if(!Hotel_notification)
                  {
                    return res.status(400).json({
                         success : false ,
                         message : 'no notification found for the Hotel'
                    })
                  }

                  return res.status(200).json({
                        success : true ,
                        message : 'Hotel Notifications',
                        notification_Count : Hotel_notification.length,
                        Notifications : Hotel_notification                       
                  })

            } catch (error) {
                return res.status(500).json({
                         success : false ,
                         message : 'server error',
                         error_message : error.message
                })
            }
        }
// Api for seen Notification

        const seen_Hotel_notification = async (req, res) => {
            try {
                const notification_id = req.params.notification_id;
          
                // check for required fields
                if (!notification_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Notification Id required'
                    });
                }
          
                // Check for notification in both models
                let notification = await Hotel_NotificationModel.findOne({ _id : notification_id });
          
                if (!notification) {
                    notification = await Hotel_NotificationModel.findOne({ _id: notification_id });
                }
          
                if (notification) {
                    // Update the notification status
                    notification.status = 0;
                    await notification.save();
          
                    return res.status(200).json({
                        success: true,
                        message: 'Notification seen '
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Notification not found'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message : error.message
                });
            }
          };
   

     // API to send Notification to all Customers for tax rate changes , new services etc

        const sendNotification_to_allCustomer = async (req, res) => {
            try {
            const { title, message } = req.body;
        
            const requiredFields = ['title', 'message'];
        
            for (const field of requiredFields) {
                if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    message: `Missing ${field.replace('_', ' ')} field `,
                });
                }
            }
        
            // Get all Customers
            const customers = await customerModel.find({});
        
            if (customers.length === 0) {
                return res.status(400).json({
                success: false,
                message: 'There is no customers found',
                });
            }
            const customerIds = [];
            // Send the same notification email to all customers
            const notifications = await Promise.all(customers.map(async (customer) => {
                customerIds.push(customer._id);
                // Prepare email content
                let messageContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${title}</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
                
                    <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">${title}</h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${customer.customerName},</p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">Greetings of the Day,</p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Title:</strong> <span style="color: #FF5733;">${title}</span></p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Message:</strong> <span style="color: #3366FF;">${message}</span></p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to contact us.</p>
                    </div>
                
                </body>
                </html>
                `;                

                // Send email notification to the user
                await notificationEmail(customer.email, 'Notification', messageContent);
        
                // Add user-specific data to the notifications array
            return {
                customerId: customer._id,
                title,
                message,               
                customerEmail: customer.email,
                customerName: customer.customerName,
                status : 1
                }
            }))
        
            // Save a single record in UsersNotificationModel
            const savedNotification = await customer_NotificationModel.create({
                title,
                message,
                date : new Date(),
                customerIds : customerIds, 
            });
                    await savedNotification.save()
            return res.status(200).json({
                success: true,
                message: 'Notifications sent',
                notification_details: savedNotification,
            });
            } catch (error) {            
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message :  error.message
            });
            }
        };


        // Api for export all bookings of the hotel
             
        const export_all_bookings_of_hotel = async (req, res) => {
            try {
              const { Hotel_Id } = req.params;
              // Check for hotel id
              if (!Hotel_Id) {
                return res.status(400).json({
                  success: false,
                  message: 'Hotel Id required',
                });
              }
          
              // Check for hotel
              const hotel = await HotelModel.findOne({ Hotel_Id: Hotel_Id });
          
              if (!hotel) {
                return res.status(400).json({
                  success: false,
                  message: 'Hotel not exist',
                });
              }
          
              // Fetch all bookings for the hotel
              const bookings = await bookedRoomModel.find({ Hotel_Id: Hotel_Id });
          
              if (bookings.length === 0) {
                return res.status(400).json({
                  success: false,
                  message: 'No bookings found for this hotel',
                });
              }
          
              // Create Excel workbook and worksheet
              const ExcelJS = require('exceljs');
              const workbook = new ExcelJS.Workbook();
              const worksheet = workbook.addWorksheet('Bookings');
          
              // Define the Excel Header
              worksheet.columns = [
                { 
                    header: 'Hotel Id', 
                    key: 'Hotel_Id', 
                    width: 15
                 },
                { 
                    header: 'Booking Id',
                    key: 'Booking_Id',
                    width: 20 
                },
                { 
                    header: 'Customer Id',
                    key: 'customerId',
                    width: 20 
                },
                { 
                    header: 'Customer Email',
                    key: 'customer_email',
                    width: 30
                 },
                { 
                    header: 'Hotel Name',
                    key: 'Hotel_name',
                    width: 20
                 },
                { 
                    header: 'Number of Rooms',
                    key: 'number_of_Rooms',
                    width: 15 
                },
                { 
                    header: 'Room Fare',
                    key: 'room_fare',
                    width: 10 
                },
                { 
                    header: 'Status',
                    key: 'status',
                    width: 15 
                },
                { 
                    header: 'Room Type',
                    key: 'roomType',
                     width: 15
                
                    },
                { 
                    header: 'Check-In',
                    key: 'checkIn',
                    width: 20
                 },
                { 
                    header: 'Check-Out',
                    key: 'checkOut',
                    width: 20
                 },               
                { 
                    header: 'Floor Number',
                    key: 'floorNumber',
                    width: 15 
                },
                { 
                    header: 'Room Number',
                    key: 'roomNumber',
                    width: 15 
                },
                {
                     header: 'Room Available',
                     key: 'roomAvailable',
                     width: 15                    
                },

                {
                     header: 'Room Price',
                     key: 'roomPrice',
                     width: 10
                },
                { 
                    header: 'Guest First Name',
                    key: 'guestFirstName',
                    width: 20
                 },
                { 
                    header: 'Guest Last Name',
                    key: 'guestLastName',
                    width: 20
                 },
                { 
                    header: 'Guest Age',
                    key: 'guestAge',
                    width: 10 
                },
                {
                     header: 'Guest Phone Number',
                     key: 'guestPhoneNumber',
                     width: 20 
                },
                { 
                    header: 'Total Guests',
                    key: 'totalGuests',
                    width: 10 
                },
                { 
                    header: 'Promo Code',
                     key: 'promoCode',
                     width: 15
                 },
                { 
                    header: 'Commission Price',
                    key: 'commissionPrice',
                     width: 15 
                },
              ];
          
              // Add rows to the worksheet
              bookings.forEach((booking) => {
                const baseRow = {
                  Hotel_Id: booking.Hotel_Id,
                  Booking_Id: booking.Booking_Id,
                  customerId: booking.customerId,
                  customer_email: booking.customer_email,
                  Hotel_name: booking.Hotel_name,
                  number_of_Rooms: booking.number_of_Rooms,
                  room_fare: booking.room_fare,
                  status: booking.status,
                  roomType: booking.roomType,
                  checkIn: booking.checkIn,
                  checkOut: booking.checkOut,                
                  totalGuests: booking.totalguests,
                  promoCode: booking.promoCode,
                  commissionPrice: booking.commision_price,
                };
          
                if (booking.bookedRoom.length > 0) {
                  booking.bookedRoom.forEach((floor) => {
                    floor.rooms.forEach((room) => {
                      worksheet.addRow({
                        ...baseRow,
                        floorNumber: floor.floorNumber,
                        roomNumber: room.roomNumber,
                        roomAvailable: room.available,
                        roomPrice: room.price,
                      });
                    });
                  });
                } else {
                  worksheet.addRow(baseRow);
                }
          
                if (booking.guests.length > 0) {
                  booking.guests.forEach((guest) => {
                    worksheet.addRow({
                      ...baseRow,
                      guestFirstName: guest.firstName,
                      guestLastName: guest.lastName,
                      guestAge: guest.age,
                      guestPhoneNumber: guest.phoneNumber,
                    });
                  });
                } else {
                  worksheet.addRow(baseRow);
                }
              });
          
              // Write to buffer
              const buffer = await workbook.xlsx.writeBuffer();
          
              // Set response headers for file download
              res.setHeader(
                'Content-Disposition',
                'attachment; filename=bookings.xlsx'
              );
              res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              );
          
              // Send the buffer
              res.send(buffer);
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message,
              });
            }
          };
          
         
                                                /* Transaction sectiom */

                // Api for get all transaction of the hotel
                const get_all_transaction_of_hotel = async ( req , res )=> {
                     try {
                        const Hotel_Id = req.params.Hotel_Id
                        // check for Hotel_Id
      
                        if(!Hotel_Id)
                        {
                            return res.status(400).json({
                             success : false ,
                             message : 'Hotel Id required'
                            })
                        }

                        // check for all transaction of the hotel

                        const all_transaction = await TransactionModel.find({ Hotel_Id : Hotel_Id })
                        if(!all_transaction)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : `No Transaction found for the Hotel : ${Hotel_Id}`
                            })
                        }
                                // sort the transaction 
                           const sorted_transaction = all_transaction.sort(( a, b ) =>  { b.createdAt - a.createdAt })

                           return res.status(200).json({
                               success : true ,
                               message : 'all transaction of the Hotel',
                               all_transaction : sorted_transaction
                           })

                     } catch (error) {
                          return res.status(500).json({
                              success : false ,
                              message : 'server error',
                              error_message : error.message
                          })
                     }
                }
          
            
    
                                                        /* contact us details */
        // Api for get all contact us details
        const getContact_Details = async ( req , res )=> {
            try {
                  // check dor all details
                  const all_details = await contact_usModel.find()
                  if(!all_details)
                  {
                     return res.status(400).json({
                          success : false,
                          message : 'No details found'
                     })
                  }

                     // sort the contact detail
                     const sorted_data = await all_details.sort(( a , b ) => {  b.createdAt - a.createdAt })

                     return res.status(200).json({
                          success : true ,
                          message : 'All Details',
                          Details : all_details
                     })
            } catch (error) {
               return res.status(500).json({
                  success : false ,
                  message : "server error",
                  error_message : error.message
               })
            }
       }

// Api for particular contact details
    const delete_contact_detail = async ( req , res )=> {
        try {
                 const contact_id = req.params.contact_id
             // check for contact id

             if(!contact_id)
             {
                   return res.status(400).json({
                       success : false ,
                       message : 'contact Id required'
                   })
             }

             // check for contact details
                const contact = await contact_usModel.findOne({ _id : contact_id })

                if(!contact)
                {
                   return res.status(400).json({
                         success : false ,
                         message : 'no Details found'
                   })
                }

                await contact.deleteOne()

                return res.status(200).json({
                     success : true ,
                     message : 'Details Deleted successfully'
                })
        } catch (error) {
            return res.status(500).json({
                success : false ,
                message : 'server error',
                error_message : error.message
            })
        }
    }
                


module.exports = {
      get_Hotels_of_HotelManager , active_inactive_Room , getAll_pending_Booking_Request ,
      getHotelRoom_for_pending_bookings, assingRoom_to_booking , getAllBookings_of_Hotel,
      updateRoom , searchBooking , privacyAndPolicy , getPrivacy_policy , term_condition,
      getHotel_term_condition , getAllComplains , getRating_Reviews , getHotel_notificaition,
      seen_Hotel_notification , sendNotification_to_allCustomer , export_all_bookings_of_hotel,
      get_all_transaction_of_hotel , getContact_Details , delete_contact_detail
}