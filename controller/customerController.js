   const express = require('express')
   const customerModel = require('../models/customerModel')
   const HotelModel = require('../models/HotelModel')
   const bookedRoomModel  = require('../models/bookedRooms')
   const bcrypt = require('bcrypt')
   const sendBookingEmail = require('../utils/sendBookingEmail')  
   const userModel = require('../models/userModel')
   const complainModel = require('../models/complainModel')
   const rating_review_Model = require('../models/rating_review_model')
    const customer_NotificationModel = require('../models/customerNotification')
    const promo_Coupon_Model = require('../models/promo_coupon')
    const TransactionModel = require('../models/transactionModel')
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const contact_usModel = require('../models/contact_us')

                                      /* customer Section */
      // Api for customer Register
       const register_customer = async( req , res)=>{
          try {
                const {customername , email , password , phone_no} = req.body

                // check for required fields
                if(!customername)
                {
                  return res.status(400).json({
                       success : false ,
                       message : 'customername required'
                  })
                }
                if(!phone_no)
                {
                  return res.status(400).json({
                       success : false ,
                       message : 'phone_no required'
                  })
                }

                if(!email)
                {
                  return res.status(400).json({
                      success : false ,
                      message : 'customer email required'
                  })
                }

                if(!password)
                {
                  return res.status(400).json({
                      success : false ,
                      message :'password is required'
                  })
                }

               // check for customer existance
            const exist_customer = await customerModel.findOne({ email : email })
            if(exist_customer)
            {
               return res.status(400).json({
                   success : false ,
                   message : 'customer registered already with these email'
               })
            }
              const saltRound = 10
              const hashedPassword = await bcrypt.hash(password , saltRound)
              const profileImage = req.file.filename
            const newData = await new customerModel({
                  customerName : customername,
                  email,
                  phone_no,
                  password : hashedPassword,
                  profileImage : profileImage,
                  status : 1

            })

            await newData.save()

            return res.status(200).json({
                success : true , 
                message : 'customer created successfully',
                customerId : newData._id
            })
          } catch (error) {
            return res.status(500).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
            })
          }
       }



       // Api for login customer
       
       
       const logincustomer = async( req , res)=>{
         try {
             const { email , password} = req.body

             // check for required field
             if(!email)
             {
               return res.status(400).json({
                    success : false ,
                    message : 'email required'
               })
             }
             if(!password)
             {
               return res.status(400).json({
                   success : false ,
                   message : 'password required'
               })
             }

             // check for customer
             const customer = await customerModel.findOne({
                           email : email,
                           status : 1
             })

             if(!customer)
             {
               return res.status(400).json({
                    success : false ,
                    message :'customer not found with these email'
               })
             }

               const isPasswordMatch = await bcrypt.compare(password , customer.password)
               if(!isPasswordMatch)
               {
                  return res.status(400).json({
                      success : false ,
                      message : 'incorrect customer password'
                  })
               }
               else
               {
                  return res.status(200).json({
                      success : true , 
                      message : 'customer login successfully',
                      customer_Details :  customer
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
   // Api for get partiular customer details
              const getcustomer_Details = async ( req , res)=>{
               try {
                        const customerId = req.params.customerId
                        // check for customerId
                  if(!customerId)
                  {
                     return res.status(400).json({
                         success : false ,
                         message : 'customerId required'
                     })
                  }
                  // check for customer
                  const customer = await customerModel.findOne({
                          _id : customerId
                  })

                  if(!customer)
                  {
                     return res.status(400).json({
                           success : false ,
                           message : 'customer not found'
                     })
                  }
                  else
                  {
                     return res.status(200).json({
                          success : true ,
                          message : 'customer Details',
                          customer_Details : customer
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

      // Api for get all customer
                 const getAllcustomer = async( req , res)=>{
                  try {
                           // check for all customer
                     const allcustomer = await customerModel.find({ })
                     if(!allcustomer)
                     {
                        return res.status(400).json({
                             success : false,
                             message : 'no customer found'
                        })
                     }
                     else
                     {
                        return res.status(200).json({
                                  success : true ,
                                  message : 'all customer details',
                                  allcustomer : allcustomer
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

    // Api for update customer ( manage Profile )
               const updatecustomer = async( req , res)=>{
                  try {
                          const customerId = req.params.customerId
                          const { customername , email , phone_no } = req.body

                          // check for customerId
                     if(!customerId)
                     {
                        return res.status(400).json({
                            success : false ,
                            message : 'customer Id required'
                        })
                     }     
                     
                        // check for customer
                        const customer = await customerModel.findOne({
                                 _id : customerId
                        })

                        if(!customer)
                        {
                           return res.status(400).json({
                                   success : false ,
                                   message : 'customer not found'
                        })
                        }

                             const profileImage = req.file.filename

                              customer.customerName = customername
                              customer.email = email
                              customer.phone_no = phone_no
                              customer.profileImage = profileImage

                              await customer.save()

                              return res.status(200).json({

                                     success : true ,
                                     message : 'customer Details updated'
                              })

                  } catch (error) {
                     return res.status(500).json({
                            success : false ,
                            message : 'server error',
                            error_message : error.message
                     })
                  }
               }               

   // Api for change password 

                     const customer_change_pass = async (req, res) => {
                        try {
                           const customerId = req.params.customerId
                           const { oldPassword, password, confirmPassword } = req.body
                           
                           // Check for customerId
                           if (!customerId) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'customerId required'
                              })
                           }
                  
                           // Check for oldPassword
                           if (!oldPassword) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'oldPassword required'
                              })
                           }
                  
                           // Check for password
                           if (!password) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'password required'
                              })
                           }
                  
                           // Check for confirmPassword
                           if (!confirmPassword) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'confirmPassword required'
                              })
                           }
                  
                           // Check for customer existence
                           const customer = await customerModel.findOne({
                              _id: customerId
                           })
                  
                           if (!customer) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'customer not found'
                              })
                           }
                  
                           // Check if password and confirmPassword matched
                           if (password !== confirmPassword) {
                              return res.status(400).json({
                                    success: false,
                                    message: 'confirmPassword not matched'
                              })
                           }
                  
                           // Check for oldPassword validity
                           const isOldPasswordValid = await bcrypt.compare(oldPassword, customer.password)
                           if (!isOldPasswordValid) {
                              return res.status(400).json({ IncorrectPassword: 'Old Password incorrect ', success: false })
                           }
                  
                           // Hash the new password
                           const saltRound = 10
                           const hashedPassword = await bcrypt.hash(password, saltRound)
                           customer.password = hashedPassword
                           await customer.save()
                  
                           return res.status(200).json({
                              success: true,
                              message: 'password changed successfully'
                           })
                  
                        } catch (error) {
                           return res.status(500).json({
                              success: false,
                              message: 'server error',
                              error_message: error.message
                           })
                        }
                  }
  
// Api for delete customer 
                      const deleteCustomer = async( req , res)=>{
                        try {
                              const today = new Date()
                              const customerId = req.params.customerId
                           // check for customerId
                        
                           if(!customerId)
                           {
                              return res.status(400).json({
                                  success : false , 
                                  message : 'customer Id required'
                              })
                           }

                           // check for customer
                           const customer = await customerModel.findOne({ _id : customerId })
                           if(!customer)
                           {
                              return res.status(400).json({
                                    success : false , 
                                    message : 'no customer details found'
                              })
                           }                         

                        // check if customer booked any hotel today or in future date
                        const hotelBooking = await bookedRoomModel.findOne({                           
                           customerId: customerId,
                           checkIn: { $gte: today }
                     });
                           if (hotelBooking) {
                              return res.status(400).json({
                                 success: false,
                                 message: `Cannot delete customer because they have booked a room in a Hotel : ${hotelBooking.Hotel_name} on Date ${hotelBooking.checkIn}`
                              });
                        }

                         await customer.deleteOne()

                         return res.status(200).json({
                                success : true , 
                                message : 'customer deleted successfully'
                         })
                           
                           
                        } catch (error) {
                           return res.status(500).json({
                                  success : false ,
                                  message : 'server error',

                           })
                        }
                      }

         // Api for active inactive customer
         const active_inactive_customer = async (req, res) => {
            try {
                const customerId = req.params.customerId;
        
                // Check if customerId is provided
                if (!customerId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Customer Id required'
                    });
                }
        
                // Find customer by customerId
                const customer = await customerModel.findOne({ _id: customerId });
        
                // Check if customer exists
                if (!customer) {
                    return res.status(400).json({
                        success: false,
                        message: 'Customer not found'
                    });
                }
        
                // Toggle customer status
                let newStatus;
                if (customer.status === 1) {
                    newStatus = 0;
                } else if (customer.status === 0) {
                    newStatus = 1;
                } else {
                    return res.status(200).json({
                        success: false,
                        message: 'Invalid status'
                    });
                }
        
                // Update customer status
                await customerModel.findByIdAndUpdate(customer._id, { status: newStatus });
        
                return res.status(200).json({
                    success: true,
                    message: `Customer ${newStatus ? 'activated' : 'inactivated'} successfully`
                });
        
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };


                                                    /*Search Hotel and booking */

         // Api for search Hotel
         const search_Hotel = async (req, res) => {
            try {
                const { city, checkIn, checkOut  } = req.body;
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Resetting hours, minutes, seconds, and milliseconds
        
                // Check for required fields
                const requiredFields = ['city', 'checkIn', 'checkOut'];
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }

        
                // Convert checkIn and checkOut dates into Date objects
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
        
                // Check for valid check-in date
                if (checkInDate < today) {
                    return res.status(400).json({
                        success: false,
                        message: `You can't select a previous date for check-in`
                    });
                }
        
                // Check if check-out date is after check-in date
                if (checkOutDate <= checkInDate) {
                    return res.status(400).json({
                        success: false,
                        message: `Check-out date must be after check-in date`
                    });
                }
        
                // Calculate number of days
                const oneDay = 24 * 60 * 60 * 1000;
                const checkInTime = 12 * 60 * 60 * 1000;
                const checkOutTime = 10 * 60 * 60 * 1000;
                const daysCount = Math.round((checkOutDate.getTime() + checkOutTime - checkInDate.getTime() - checkInTime) / oneDay) || 1;
        
                // Get hotels based on city
                const hotels = await HotelModel.find({ city });
        
                const resultHotels = [];
        
                for (let hotel of hotels) {
                    let totalRooms = 0;
                    let availableRoomTypeCounts = {};
                    let bookedRoomTypeCounts = {};
                    let roomPricesByType = {}; // Create a separate room prices object for each hotel
                 
              

                    const bookedRooms = await bookedRoomModel.find({
                        Hotel_Id: hotel.Hotel_Id,
                        checkIn: { $lte: new Date(checkOutDate.getTime() + 24 * 60 * 60 * 1000) },
                        checkOut: { $gte: checkInDate },
                        $or: [
                            { status: "confirmed" },
                            { status: "pending" }
                        ],
                    });
        
                    // Calculate total number of rooms in the hotel and room prices
                    hotel.floors.forEach(floor => {
                        totalRooms += floor.rooms.length;
                        floor.rooms.forEach(room => {
                            const roomType = room.type;
                            const baseroomPrice = room.price;                           
                          
                           
                            const updatedRoomPrice = (baseroomPrice * daysCount)  ;
        
                            if (!roomPricesByType[roomType]) {
                                roomPricesByType[roomType] = updatedRoomPrice;
                            }
        
                            if (!availableRoomTypeCounts[roomType]) {
                                availableRoomTypeCounts[roomType] = 0;
                            }
                            availableRoomTypeCounts[roomType]++;
                        });
                    });
        
                    // Count the total number of booked rooms and their types
                    for (const booking of bookedRooms) {
                        const roomType = booking.roomType;
        
                        if (roomType !== undefined && roomType !== null) {
                            if (!bookedRoomTypeCounts[roomType]) {
                                bookedRoomTypeCounts[roomType] = 0;
                            }
                            bookedRoomTypeCounts[roomType]++;
                        }
                    }
        
                    // Check availableRoomTypeCounts to ensure all room types are accounted for in bookedRoomTypeCounts
                    for (const roomType in availableRoomTypeCounts) {
                        if (!bookedRoomTypeCounts.hasOwnProperty(roomType)) {
                            bookedRoomTypeCounts[roomType] = 0;
                        }
                    }
        
                    hotel.totalRooms = totalRooms;
                    hotel.availableRooms = totalRooms - bookedRooms.length; // Assuming each booking reserves one room
                    hotel.bookedRoomsCount = bookedRooms.length;
                    hotel.availableRoomTypeCounts = availableRoomTypeCounts;
                    hotel.bookedRoomTypeCounts = bookedRoomTypeCounts;
                    hotel.roomPricesByType = roomPricesByType;                  
                  
                    
                    // Calculate average rating for the hotel
                    const ratingsAndReviews = await rating_review_Model.find({ Hotel_Id: hotel.Hotel_Id });
                    let totalRating = 0;
                    let totalReviews = ratingsAndReviews.length;
        
                    ratingsAndReviews.forEach(review => {
                        totalRating += review.rating;
                         
                    });
        
                    hotel.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
                    
        
                    resultHotels.push({
                        _id: hotel._id,
                        Hotel_Id: hotel.Hotel_Id,
                        Hotel_name: hotel.Hotel_name,
                        address: hotel.address,
                        city: hotel.city,
                        manager_id: hotel.manager_id,
                        HotelImages: hotel.HotelImages,
                        hotelType: hotel.hotelType,
                        facilities: hotel.facilities,
                        aboutHotel: hotel.aboutHotel,
                        totalRooms: hotel.totalRooms,
                        bookedRoomsCount: hotel.bookedRoomsCount,
                        availableRooms: hotel.availableRooms,
                        availableRoomTypeCounts: Object.keys(hotel.availableRoomTypeCounts).reduce((acc, key) => {
                            acc[key] = hotel.availableRoomTypeCounts[key] - (hotel.bookedRoomTypeCounts[key] || 0);
                            return acc;
                        }, {}),
                        bookedRoomTypeCounts: hotel.bookedRoomTypeCounts,
                        room_price : roomPricesByType, 
                        Rating: hotel.averageRating || 5
                        
                    
                    });
                }                    

                return res.status(200).json({
                    success: true,
                    message: "Hotels",
                    city: city,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    Hotel_count : resultHotels.length ,
                    hotels: resultHotels
                });
        
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: "Server error",
                    error_message : error.message
                });
            }
        };          

  

        // APi for filter hotel
        const filter_Hotel = async (req, res) => {
            try {
                const { city, checkIn, checkOut } = req.body;
                const { room_price, rating, hotel_type, availableRooms  } = req.query;
                
               
        
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Resetting hours, minutes, seconds, and milliseconds
            
                // Check for required fields
                const requiredFields = ['city', 'checkIn', 'checkOut'];
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
            
                // Convert checkIn and checkOut dates into Date objects
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
            
                // Check for valid check-in date
                if (checkInDate < today) {
                    return res.status(400).json({
                        success: false,
                        message: `You can't select a previous date for check-in`
                    });
                }
            
                // Check if check-out date is after check-in date
                if (checkOutDate <= checkInDate) {
                    return res.status(400).json({
                        success: false,
                        message: `Check-out date must be after check-in date`
                    });
                }
            
                // Calculate number of days
                const oneDay = 24 * 60 * 60 * 1000;
                const checkInTime = 12 * 60 * 60 * 1000;
                const checkOutTime = 10 * 60 * 60 * 1000;
                const daysCount = Math.round((checkOutDate.getTime() + checkOutTime - checkInDate.getTime() - checkInTime) / oneDay) || 1;
            
                // Get hotels based on city
                const hotels = await HotelModel.find({ city });
            
                const resultHotels = [];
            
                for (let hotel of hotels) {
                    let totalRooms = 0;
                    let availableRoomTypeCounts = {};
                    let bookedRoomTypeCounts = {};
                    let roomPricesByType = {};
            
                    const bookedRooms = await bookedRoomModel.find({
                        Hotel_Id: hotel.Hotel_Id,
                        checkIn: { $lte: new Date(checkOutDate.getTime() + 24 * 60 * 60 * 1000) },
                        checkOut: { $gte: checkInDate },
                        $or: [
                            { status: "confirmed" },
                            { status: "pending" }
                        ],
                    });
            
                    // Calculate total number of rooms in the hotel and room prices
                    hotel.floors.forEach(floor => {
                        totalRooms += floor.rooms.length;
                        floor.rooms.forEach(room => {
                            const roomType = room.type;
                            const baseRoomPrice = room.price;
            
                            const updatedRoomPrice = (baseRoomPrice * daysCount);
            
                            if (!roomPricesByType[roomType]) {
                                roomPricesByType[roomType] = updatedRoomPrice;
                            }
            
                            if (!availableRoomTypeCounts[roomType]) {
                                availableRoomTypeCounts[roomType] = 0;
                            }
                            availableRoomTypeCounts[roomType]++;
                        });
                    });
            
                    // Count the total number of booked rooms and their types
                    for (const booking of bookedRooms) {
                        const roomType = booking.roomType;
            
                        if (roomType !== undefined && roomType !== null) {
                            if (!bookedRoomTypeCounts[roomType]) {
                                bookedRoomTypeCounts[roomType] = 0;
                            }
                            bookedRoomTypeCounts[roomType]++;
                        }
                    }
            
                    // Check availableRoomTypeCounts to ensure all room types are accounted for in bookedRoomTypeCounts
                    for (const roomType in availableRoomTypeCounts) {
                        if (!bookedRoomTypeCounts.hasOwnProperty(roomType)) {
                            bookedRoomTypeCounts[roomType] = 0;
                        }
                    }
            
                    hotel.totalRooms = totalRooms;
                    hotel.availableRooms = totalRooms - bookedRooms.length; // Assuming each booking reserves one room
                    hotel.bookedRoomsCount = bookedRooms.length;
                    hotel.availableRoomTypeCounts = availableRoomTypeCounts;
                    hotel.bookedRoomTypeCounts = bookedRoomTypeCounts;
                    hotel.roomPricesByType = roomPricesByType;
            
                    // Calculate average rating for the hotel
                    const ratingsAndReviews = await rating_review_Model.find({ Hotel_Id: hotel.Hotel_Id });
                    let totalRating = 0;
                    let totalReviews = ratingsAndReviews.length;
            
                    ratingsAndReviews.forEach(review => {
                        totalRating += review.rating;
                    });
            
                    hotel.averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
            
                    // Apply filters
                    let passesFilters = true;
            
                    // Define priceRange
                    const priceRange = 0.1; // 10% range for price filter
        
                    if (room_price) {
                        const priceInt = parseInt(room_price);
                        if (Number.isNaN(priceInt)) {
                            return res.status(400).json({
                                success: false,
                                message: `Invalid room_price value`
                            });
                        }
            
                        // Check if roomPricesByType has values and handle accordingly
                        const isWithinRange = Object.keys(roomPricesByType).length > 0 && Object.values(roomPricesByType).some(price => {
                            const lowerBound = price * (1 - priceRange);
                            const upperBound = price * (1 + priceRange);
                            return priceInt >= lowerBound && priceInt <= upperBound;
                        });
            
                        if (!isWithinRange) {
                            passesFilters = false;
                        }
                    }
            
                    if (rating && hotel.averageRating < parseFloat(rating)) {
                        passesFilters = false;
                    }
            
                    if (hotel_type && hotel.hotelType !== hotel_type) {
                        passesFilters = false;
                    }
            
                    if (availableRooms && hotel.availableRooms < parseInt(availableRooms)) {
                        passesFilters = false;
                    }
            
                   
            
                    if (passesFilters) {
                        resultHotels.push({
                            _id: hotel._id,
                            Hotel_Id: hotel.Hotel_Id,
                            Hotel_name: hotel.Hotel_name,
                            address: hotel.address,
                            city: hotel.city,
                            manager_id: hotel.manager_id,
                            HotelImages: hotel.HotelImages,
                            hotelType: hotel.hotelType,
                            facilities: hotel.facilities,
                            aboutHotel: hotel.aboutHotel,
                            totalRooms: hotel.totalRooms,
                            bookedRoomsCount: hotel.bookedRoomsCount,
                            availableRooms: hotel.availableRooms,
                            availableRoomTypeCounts: Object.keys(hotel.availableRoomTypeCounts).reduce((acc, key) => {
                                acc[key] = hotel.availableRoomTypeCounts[key] - (hotel.bookedRoomTypeCounts[key] || 0);
                                return acc;
                            }, {}),
                            bookedRoomTypeCounts: hotel.bookedRoomTypeCounts,
                            room_price: roomPricesByType,
                            Rating: hotel.averageRating || 5
                        });
                    }
                }
            
                return res.status(200).json({
                    success: true,
                    message: "Filtered Hotels",
                    city: city,
                    checkIn: checkIn,
                    checkOut: checkOut,
                    Hotel_count: resultHotels.length,
                    hotels: resultHotels
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
        
        
        
        
 
    // APi for book Hotel
   
    const bookHotel = async (req, res) => {
        try {
            const hotelId = req.params.hotelId;
            const { checkIn, checkOut, roomType, customerId, number_of_Rooms , promoCode , payment_key , payment } = req.body;
            let guests = req.body.guests;
    
            // Check for required fields
            const requiredFields = ['checkIn', 'checkOut', 'roomType', 'customerId', 'number_of_Rooms', 'guests'];
    
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({
                        success: false,
                        message: `Missing ${field.replace('_', ' ')} field`
                    });
                }
            }
    
            // Convert check-in and check-out dates into Date objects
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
    
            // Check if check-in and check-out dates are valid
            const today = new Date();
            today.setDate(today.getDate() - 1);
    
            if (checkInDate < today || checkOutDate < today || checkOutDate < checkInDate) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid check-in or check-out dates`
                });
            }
                 // calculate number of days
                 const oneDay =  24 * 60 * 60 * 1000
                 const checkInTime = 12 * 60 * 60 * 1000;
                 const checkOutTime = 10 * 60 * 60 * 1000;
                 const daysCount = Math.round((checkOutDate.getTime() + checkOutTime - checkInDate.getTime() - checkInTime) / oneDay) || 1 ;

            // Check for Hotel
            const hotel = await HotelModel.findOne({ Hotel_Id: hotelId });
            if (!hotel) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel not found'
                });
            }
                var commision_rate = hotel.commision_rate || 0
              
            const manager_id = hotel.manager_id;
            // Access room price based on roomType
                let room_fare;
                for (const floor of hotel.floors) {
                    for (const room of floor.rooms) {
                        if (room.type === roomType) {
                            const baseroom_fare = room.price;
                            room_fare = baseroom_fare * daysCount
                            break;
                        }
                    }
                    if (room_fare) break;
                }
    
            // check for hotel manager
            const hotel_manager = await userModel.findOne({ manager_id });
            if (!hotel_manager) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel manager does not exist'
                });
            }
    
            // Access Hotel manager email
            const hotelManager_Email = hotel_manager.email;
    
            // Check for customer
            const customer = await customerModel.findById(customerId);
            if (!customer) {
                return res.status(400).json({
                    success: false,
                    message: 'Customer does not exist'
                });
            }
            const customerName = customer.customerName;
            const customer_email = customer.email;
    
            // Determine room capacity based on room type
            let roomCapacity;
            // Iterate through each floor and room to find the matching room type
                for (const floor of hotel.floors) {
                    for (const room of floor.rooms) {
                        if (room.type === roomType && room.capacity) {
                            roomCapacity = room.capacity;
                            break;
                        }
                    }
                    if (roomCapacity) break;
                }

            // If room capacity is not found, set default capacity
                if (!roomCapacity) {
                    switch (roomType) {
                        case 'standard':
                            roomCapacity = 4;
                            break;
                        case 'deluxe':
                            roomCapacity = 2;
                            break;
                        default:
                            roomCapacity = 1; // Default capacity
                            break;
                    }
                }

                         const maxChildrenAge = 5;
                        let childrenCount = 0;
                        let regularGuestsCount = 0;

                        // Iterate through guests to count children and regular guests
                        guests.forEach(guest => {
                            if (guest.age < maxChildrenAge) {
                                childrenCount++;
                            } else {
                                regularGuestsCount++;
                            }
                        }); 

                        // Only two children under the age of 8 are allowed
                        if (childrenCount > 2) {
                            return res.status(400).json({
                                success: false,
                                message: `Only two children under the age of ${maxChildrenAge} are allowed in a ${roomType} room.`
                            });
                        }

                        // Total guests count includes both children and regular guests
                        const totalGuests =  regularGuestsCount;

                        if (totalGuests > roomCapacity * number_of_Rooms) {
                            return res.status(400).json({
                                success: false,
                                message: `Guests limit exceeded. Maximum allowed guests for ${number_of_Rooms} ${roomType} room(s) is ${roomCapacity * number_of_Rooms}.`
                            });
                        }

                          // check for payment_key 
                          // 1 for stripe 
                          // 2 for pay pal
                       // Function to generate a random number
function generateRandomNumber(length) {
    var result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

   

// Function to generate a unique booking ID
const generateUniqueBookingId = async () => {
    let booking_Id;
    let existingTransaction;

    do {
        booking_Id = `BKID${generateRandomNumber(6)}`; // Generate a random ID
     
        existingTransaction = await TransactionModel.findOne({ bookingId: booking_Id });
    } while (existingTransaction); // Continue until a unique ID is found

    return booking_Id;
};

    // Send email to the hotel manager for each room
    const emailContent = ` <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">

        <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Booking Confirmation</h2>
            <p>A new booking request has arisen from<strong> ${customerName}  </strong> for <strong> ${hotel.Hotel_name}</strong> , <strong> ${number_of_Rooms}</strong> Room</p>
        </div>

    </body>
    </html>`;

    
                            // Send E-mail to customer regarding Booking
                            const emailContent1 = `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Booking Confirmation</title>
                            </head>
                            <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
            
                                <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Booking Confirmation</h2>
                                    <p>Your Hotel Booking Request has been<strong> received. </strong>  A confirmation will be sent to you shortly</p>
                                    <p>If you have any questions, feel free to contact us.</p>
                                </div>
            
                            </body>
                            </html>`;


if (payment_key === 1) {
    try {
        // Set the commission
        const commision_price = (room_fare * (commision_rate / 100));

        // Check if promo code is valid
        if (promoCode) {
            const check_promo_code = await promo_Coupon_Model.findOne({ promo_code: promoCode });

            if (!check_promo_code || new Date() > check_promo_code.end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Applied promo code is not valid'
                });
            }

            // Check if promo code usage has exceeded its limit
            const promo_codeUsageCount = await bookedRoomModel.countDocuments({ promoCode });
            if (promo_codeUsageCount > check_promo_code.limit) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code usage limit has been exceeded'
                });
            }

            if (checkInDate < check_promo_code.start_Date || checkInDate > check_promo_code.end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Applied promo code is not valid for the selected check-in date'
                });
            }

            const discount = check_promo_code.discount / 100;
            const discount_price = room_fare * discount;
            room_fare -= discount_price;
        }

        // Convert room fare into cents
        const room_fare_in_Cents = room_fare * 100;

        // Create charge with Stripe
        const charge = await stripe.charges.create({
            amount: room_fare_in_Cents,
            currency: 'usd',
            description: 'Hotel Room Booking',
            source: payment, // Token Id
            receipt_email: customer_email,
        });

        const charge_status = charge.status;

        // Check if the charge was successful
        if (charge_status === 'succeeded') {
            const bookingIds = [];
            for ( var i = 0; i < number_of_Rooms; i++) {
                const booking_Id = await generateUniqueBookingId(); // Ensure unique booking ID
                bookingIds.push(booking_Id);

                // Store the payment transaction
                const transaction = new TransactionModel({
                    bookingId : booking_Id,
                    transaction_Id: charge.id,
                    Hotel_Id: hotelId,
                    amount: room_fare,
                    currency: 'usd',
                    payment_status: charge_status,
                    payment_key,
                    promoCode: promoCode || null,
                    discount_price: discount_price || 0,
                });

                await transaction.save();

                // Create booking object for each room
                const booking = {
                    Hotel_Id: hotelId,
                    Hotel_name: hotel.Hotel_name,
                    customer_email: customer_email,
                    Booking_Id: booking_Id,
                    roomType: roomType,
                    customerId: customerId,                   
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    room_fare: room_fare,
                    bookedRoom: [],
                    promoCode: promoCode || null,
                    commision_price: commision_price,
                    guests: guests.slice( i * roomCapacity, (i + 1) * roomCapacity) // Slice guests for each room
                };

                await bookedRoomModel.create(booking);
            }

            return res.status(200).json({
                success: true,
                message: 'Booking successful',
                bookingIds: bookingIds
            });
        } else {
            const bookingIds = [];
            for (var i = 0; i < number_of_Rooms; i++) {
                const booking_Id = await generateUniqueBookingId(); // Ensure unique booking ID
                bookingIds.push(booking_Id);

                // Store the payment transaction with failed status
                const transaction = new TransactionModel({
                    bookingId : booking_Id,
                    transaction_Id: charge.id,
                    Hotel_Id: hotelId,
                    amount: room_fare,
                    currency: 'usd',
                    payment_status: charge_status,
                    payment_key,
                    promoCode: promoCode || null,
                    discount_price: discount_price || 0,
                });

                await transaction.save();
            }
                // email to hotel manager
            sendBookingEmail(hotelManager_Email, `Hotel Booking ..!`, emailContent);
                // email to customer
            sendBookingEmail(customer_email, `Hotel Booking ..!`, emailContent1);

            return res.status(400).json({
                success: false,
                message: 'Payment failed',
                bookingIds: bookingIds
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error while making stripe payment',
            error_message: error.message
        });
    }
}

if (payment_key === 2) {
    try {
        // Set the commission
        const commision_price = (room_fare * (commision_rate / 100));

        // Check if promo code is valid
        if (promoCode) {
            const check_promo_code = await promo_Coupon_Model.findOne({ promo_code: promoCode });

            if (!check_promo_code || new Date() > check_promo_code.end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Applied promo code is not valid'
                });
            }

            // Check if promo code usage has exceeded its limit
            const promo_codeUsageCount = await bookedRoomModel.countDocuments({ promoCode });
            if (promo_codeUsageCount > check_promo_code.limit) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code usage limit has been exceeded'
                });
            }

            if (checkInDate < check_promo_code.start_Date || checkInDate > check_promo_code.end_Date) {
                return res.status(400).json({
                    success: false,
                    message: 'Applied promo code is not valid for the selected check-in date'
                });
            }

            const discount = check_promo_code.discount / 100;
            var discount_price = room_fare * discount;
            room_fare -= discount_price;
        }

        const bookingIds = [];
        for ( var i = 0; i < number_of_Rooms; i++) {
            const booking_Id = await generateUniqueBookingId(); // Ensure unique booking ID
            bookingIds.push(booking_Id);

            // Store the payment transaction
            const transaction = new TransactionModel({
                bookingId : booking_Id,
                transaction_Id: 'xyz', 
                Hotel_Id: hotelId,
                amount: room_fare,
                currency: 'usd',
                payment_status: 'charge_status', 
                payment_key,
                promoCode: promoCode || null,
                discount_price: discount_price || 0,
            });

            await transaction.save();

            // Create booking object for each room
            const booking = {
                Hotel_Id: hotelId,
                Hotel_name: hotel.Hotel_name,
                customer_email: customer_email,
                Booking_Id: booking_Id,
                roomType: roomType,
                customerId: customerId,               
                checkIn: checkInDate,
                checkOut: checkOutDate,
                room_fare: room_fare,
                bookedRoom: [],
                promoCode: promoCode || null,
                commision_price: commision_price,
                guests: guests.slice(i * roomCapacity, (i + 1) * roomCapacity) // Slice guests for each room
            };

            await bookedRoomModel.create(booking);
        }
             // email to hotel manager
             sendBookingEmail(hotelManager_Email, `Hotel Booking ..!`, emailContent);
             // email to customer
            sendBookingEmail(customer_email, `Hotel Booking ..!`, emailContent1);
                
        return res.status(200).json({
            success: true,
            message: 'Booking successful',
            bookingIds: bookingIds
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Error while making payment using PayPal',
            error_message: error.message
        });
    }
}


                            // Return success response with all booking IDs
                            return res.status(200).json({
                                success: true,
                                message: "Hotel booking request sent successfully",
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
      
   

 


// APi for get my upcoming Bookings
                const getUpcomingBookings = async (req, res) => {
                    try {
                        const customerId = req.params.customerId;
                        const today = new Date();                       
                        today.setHours(0, 0, 0, 0);
                      
                        // Check for required fields
                        if (!customerId) {
                            return res.status(400).json({
                                success: false,
                                message: 'Customer Id required'
                            });
                        }

                        // Check for upcoming bookings
                        const upcomingBookings = await bookedRoomModel.find({
                            customerId: customerId,
                            checkIn : { $lte: today },
                            checkOut : { $gte: today } ,
                            $or: [
                                { status : "confirmed" }
                            ]
                            
                        });

                        return res.status(200).json({
                            success: true,
                            message: 'Upcoming bookings Details',
                            upcomingBookings: upcomingBookings
                        });
                    } catch (error) {
                        return res.status(500).json({
                            success: false,
                            message: 'Server error',
                            error_message: error.message
                        });
                    }
                };

                
    
    // APi for get my recent Bookings

              const getRecent_Bookings = async( req , res)=>{
                try {
                     customerId = req.params.customerId
                     // check for customerId
                     if(!customerId)
                     {
                        return res.status(400).json({
                             success : false , 
                             message : 'customerId required'
                        })
                     }

                     const today = new Date()
                     today.setHours(0,0,0,0)

                     // check for recent Bookings
                     const recentBookings = await bookedRoomModel.find({
                                customerId : customerId,
                                checkOut : {  $lt : today }
                     })

                     if(!recentBookings)
                     {
                        return res.status(400).json({
                              success : false , 
                              message : 'No Booking History found '
                        })
                     }
                     return res.status(200).json({
                         success : true , 
                         message : 'all Recent Bookings',
                         Bookings : recentBookings
                     })
                } catch (error) {
                       return res.status(500).json({
                           success : false , 
                           message : 'server error',
                           error_message : error.message
                       })
                }
              }
    
 // Api for cancle Booking
                                    const cancelBooking = async (req, res) => {
                                        try {
                                            const Booking_Id = req.body.Booking_Id;

                                            // Check if Booking_Id is provided
                                            if (!Booking_Id) {
                                                return res.status(400).json({
                                                    success: false,
                                                    message: 'Booking Id required'
                                                });
                                            }

                                            // Find the booking
                                            const booking = await bookedRoomModel.findOne({ Booking_Id });

                                            if (!booking) {
                                                return res.status(404).json({
                                                    success: false,
                                                    message: 'Booking not found'
                                                });
                                            }
                                                        // check booking already cancelled 
                                                if(booking.status === 'cancelled')
                                                    {
                                                        return res.status(400).json({ 
                                                             success : false ,
                                                             message :  `Booking already cancelled with the provided Booking Id : ${Booking_Id}`
                                                        })
                                                    }
                                            // Check if today's date has passed the check-in date
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);

                                            if (booking.checkIn < today) {
                                                return res.status(400).json({
                                                    success: false,
                                                    message: "Cannot cancel booking. Check-in date has already passed."
                                                });
                                            }

                                            let refundAmount = 0;

                                            // Calculate refund amount (80% of total booking amount)
                                            if (booking.checkIn > today) {
                                                refundAmount = 0.8 * booking.room_fare;
                                            }

                                            // Update booking status to cancelled
                                            await bookedRoomModel.updateOne({ Booking_Id }, { status: "cancelled" });

                                            const customer_email = booking.customer_email;

                                            // Prepare cancellation email content
                                            const cancelContent = `
                                                <!DOCTYPE html>
                                                <html lang="en">
                                                <head>
                                                    <meta charset="UTF-8">
                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <title>Booking Cancellation</title>
                                                </head>
                                                <body style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">

                                                    <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                                        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Booking Cancellation</h2>
                                                        <p>Your booking with Booking ID <strong>${Booking_Id}</strong> has been cancelled successfully. You are entitled to a refund of <strong>${refundAmount}</strong> units.</p>
                                                        <p>If you have any questions, feel free to contact us.</p>
                                                    </div>

                                                </body>
                                                </html>
                                            `;

                                            // Send cancellation email
                                            sendBookingEmail(customer_email, 'Booking Cancellation', cancelContent);

                                            // Return success response with refund information
                                            return res.status(200).json({
                                                success: true,
                                                message: "Booking cancelled successfully",
                                                booking_Id: Booking_Id,
                                                
                                            });
                                        } catch (error) {
                                            return res.status(500).json({
                                                success: false,
                                                message: 'Server error',
                                                error_message: error.message
                                            });
                                        }
                                    };

                                                        /* complains section */
        // Api for create Complain for the hotel
         
              const createComplain = async( req , res)=>{
                try {                      
                        const {
                                guest_name , email ,Booking_Id, phone , roomNumber , complain_type , description, status
                        } = req.body

                   
                 
                // Check for required fields
                const requiredFields = ['guest_name', 'email', 'phone', 'roomNumber','Booking_Id', 'complain_type' , 'description'];
        
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
                      // check for hotelId
                                if(!Booking_Id)
                                {
                                    return res.status(400).json({
                                         success : false , 
                                         message : 'Booking_Id required'
                                    })
                                }

                    // check for Booking 
                    const Booking = await bookedRoomModel.findOne({
                        Booking_Id : Booking_Id
                    })
                       if(!Booking)
                       {
                        return res.status(400).json({
                             success : false ,
                             message : `No Booking Done yet for the Booking_Id : ${Booking_Id}`
                        })
                       }
                // create new record 
                   const newData = new complainModel({
                       Booking_Id , 
                       guest_name,
                        email,
                        phone,
                        roomNumber,
                        complain_type,
                        description,
                        status : 1
                   })

                      await newData.save()

                      return res.status(200).json({
                           success : true , 
                           message : 'Your complaint has been registered'
                      })
                
                } catch (error) {
                    return res.status(500).json({
                             success : false , 
                             message : 'server error',
                             error_message : error.message
                    })
                }
              }
    
    
    
                                           /* Rating Review Section */
        
        // Api for give Rating and Review to Hotel

        const createRatingReview = async (req, res) => {
            try {
                const { customerId, hotelId } = req.params;
                const { rating, review } = req.body;
        
                // Check for required fields
                const requiredFields = [ 'rating', 'review'];
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
        
                // Check if the rating is within the valid range
                if (rating < 0 || rating > 5) {
                    return res.status(400).json({
                        success: false,
                        message: 'Rating should be in the range of 0 to 5'
                    });
                }
        
                // Check if the customer exists
                const customer = await customerModel.findOne({ _id: customerId });
                if (!customer) {
                    return res.status(400).json({
                        success: false,
                        message: 'No customer details found'
                    });
                }
        
                // Check if the hotel exists
                const hotel = await HotelModel.findOne({ Hotel_Id : hotelId });
                if (!hotel) {
                    return res.status(400).json({
                        success: false,
                        message: 'Hotel not found'
                    });
                }
        
                // Check if a rating and review already exist for this customer
                let existingRR = await rating_review_Model.findOne({ customerId , Hotel_Id : hotelId });
        
                if (existingRR) {
                    // Update existing rating and review
                    existingRR.rating = rating;
                    existingRR.review = review;
                    await existingRR.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Rating & review updated successfully'
                    });
                } else {
                    // Create new record
                    const newRR = new rating_review_Model({
                        customerId,
                        customer_Image: customer.profileImage,
                        customer_Name: customer.customerName,
                        rating,
                        review,
                        Hotel_Id : hotelId 
                    });
        
                    await newRR.save();
                    return res.status(200).json({
                        success: true,
                        message: 'Rating & review added successfully'
                    });
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
                                                /* Notification section */


            // Api for get particular customer notifications
            
            const customer_Notification = async (req, res) => {
                try {
                    const customerId = req.params.customerId;
                    // Check for customerId
                    if (!customerId) {
                        return res.status(400).json({
                            success: false,
                            message: 'Customer Id required'
                        });
                    }
            
                    // Check for customer notification
                    const customer_Notifications = await customer_NotificationModel.find({
                        $or: [
                            { customerId: customerId },
                            { customerIds: { $in: [customerId] } }
                        ]
                    });
            
                    if (!customer_Notifications || customer_Notifications.length === 0) {
                        return res.status(400).json({
                            success: false,
                            message: "No customer notifications found"
                        });
                    }
            
                    const notification_details = customer_Notifications.map(notification => {
                        return {
                            _id: notification._id,                          
                            title: notification.title,
                            message: notification.message,
                            status: notification.status,
                            createdAt : notification.createdAt || null,
                            updatedAt : notification.updatedAt || null
                        };
                    });

                    const sortedNotification = notification_details.sort((a, b) => b.createdAt - a.createdAt);
                        
                    return res.status(200).json({
                        success: true,
                        message: 'Notifications of the customer',
                        notification_count: customer_Notifications.length,
                        Details: sortedNotification
                    });
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            };
            

            // Api for seen Notification

        const seen_customer_notification = async (req, res) => {
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
                let notification = await customer_NotificationModel.findOne({ _id : notification_id });
          
                if (!notification) {
                    notification = await customer_NotificationModel.findOne({ _id: notification_id });
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
   
        
        
                                                        /* Contact us Section */
            
                // Api for contact us
                const contact_us = async ( req , res )=> {
                      try {
                            const { Name , email , message } = req.body
                        
                        // check for required fields
                        const requiredFields = ['Name' , 'email' , 'message' ]
                        for( let field of requiredFields)
                        {
                              if(!req.body[field])
                              {
                                   return res.status(400).json({
                                      success : false ,
                                      message : `Missing ${field.replace('_'),(' ')}`
                                   })
                              }
                        }

                            // add new data
                               const newData = new contact_usModel({
                                  Name  ,
                                  email,
                                  message
                               })

                               await newData.save()

                               return res.status(200).json({
                                 success : true ,
                                 message : ' New Data Saved successfully'
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
      register_customer , logincustomer , updatecustomer , getcustomer_Details , getAllcustomer , customer_change_pass , 
      deleteCustomer , active_inactive_customer , search_Hotel , bookHotel , getUpcomingBookings , getRecent_Bookings ,
      createComplain , cancelBooking , createRatingReview , customer_Notification , seen_customer_notification , filter_Hotel ,
      contact_us
   } 