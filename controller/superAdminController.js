const express = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs')
const sendManagerRegisterEmail = require('../utils/sendEmails')
const userModel = require('../models/userModel')
const HotelModel = require('../models/HotelModel')
const customerModel = require('../models/customerModel')
const bookedRoomModel = require('../models/bookedRooms')
const privacy_policyModel = require('../models/privacy_policyModel');
const term_conditionModel = require('../models/term_conditionModel')
const rating_review_Model = require('../models/rating_review_model')
const customer_NotificationModel = require('../models/customerNotification')
const notificationEmail = require('../utils/NotificationEmail')
const Hotel_NotificationModel = require('../models/Hotel_notification')
const promo_Coupon_Model = require('../models/promo_coupon')
const promoCodeEmail = require('../utils/promoCode_email')

                                    /* Super Admin section */

    // APi for login superAdmin

           const login = async( req ,res)=>{
            try {                    
                    const { email , password } = req.body
              // check for required fields
             
                 
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

                 // check for super admin

                 const userlogin = await userModel.findOne({
                      email : email
                 })
                 if(!userlogin)
                 {
                    return res.status(400).json({
                             success : false ,
                             message : 'email incorrect'
                    })
                 }

                 // Check if the stored password is in plain text
                        if (userlogin.password && userlogin.password.startsWith("$2b$")) {
                            // Password is already bcrypt hashed
                        const passwordMatch = await bcrypt.compare(password, userlogin.password);
                
                        if (!passwordMatch) {
                            return res
                            .status(400)
                            .json({ message: "Password incorrect", success: false });
                        }
                    } else {
                        // Convert plain text password to bcrypt hash
                        const saltRounds = 10;
                        const hashedPassword = await bcrypt.hash(password, saltRounds);
                
                        // Update the stored password in the database
                        userlogin.password = hashedPassword;
                        await userlogin.save();
                    }
  
                    return res.json({
                        message: "Login Successfully ...!",
                        success: true,
                        Details : userlogin,
                    });                    
                                

                        } catch (error) {
                            return res.status(500).json({
                                success : false ,
                                message : 'server error',
                                error_message : error.message
                            })
                        }
                    }

              // Api for get superAdmin details
                       const getsuperAdmin = async( req , res)=>{
                        try {
                                const superAdmin_id = req.params.superAdmin_id

                            const superAdmin = await userModel.find({_id : superAdmin_id })
                            if(!superAdmin)
                            {
                                return res.status(400).json({
                                     success : false ,
                                     message : 'super admin not found'
                                })
                            }
                            else
                            {
                                  return res.status(200).json({
                                        success : true ,
                                        message : 'super admin details',
                                        details : superAdmin
                                  })
                            }
                            
                        } catch (error) {
                              return res.status(500).json({
                                     success : false ,
                                     message : 'server error'
                              })
                        }
                       }

        // Api for update super admin details

             const updateSuperAdmin_details = async ( req , res)=>{
                try {

                      const superAdmin_id = req.params.superAdmin_id
                      const { 
                        name ,
                        email} = req.body

                        // check for required fields

                        if(!superAdmin_id)
                        {
                            return res.status(400).json({
                                   success : false ,
                                   message : 'super admin Id required'
                            })
                        }

                        if(!name)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'SuperAdmin name required'
                            })
                        }

                        if(!email)
                        {
                            return res.status(400).json({
                                     success : false ,
                                     message : 'super admin email required'
                            })
                        }

                        // check for super admin
                        const superAdmin = await userModel.findOne({ _id : superAdmin_id })
                        if(!superAdmin)
                        {
                            return res.status(400).json({
                                  success : false ,
                                  message : 'super admin not found'
                            })
                        }
                          const profileImage = req.file.filename

                          superAdmin.name = name
                          superAdmin.email = email
                          superAdmin.profileImage = profileImage

                          await superAdmin.save()

                          return res.status(200).json({
                               success : true ,
                               message : 'super admin details updated'
                          })
                         
                } catch (error) {
                    return res.status(500).json({
                                success : false , 
                                message : 'server error',
                                error_message : error.message
                    })
                }
             }


     // Api for change super admin profile password
                            const superAdmin_change_password = async(req , res) => {
                                try {
                                    const superAdmin_id = req.params.superAdmin_id;
                                    const { oldPassword , password , confirmPassword} = req.body;
                            
                                    // Check if superAdmin_id is provided
                                    if (!superAdmin_id) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'superAdmin Id required'
                                        });
                                    }
                            
                                    // Check if oldPassword is provided
                                    if (!oldPassword) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'old password required'
                                        });
                                    }
                            
                                    // Check if password is provided
                                    if (!password) {
                                        return res.status(400).json({
                                            success: false,
                                            password_message: 'password required'
                                        });
                                    }
                            
                                    // Check if confirmPassword is provided
                                    if (!confirmPassword) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'confirmPassword required'
                                        });
                                    }
                            
                                    // Check if password and confirmPassword match
                                    if (password !== confirmPassword) {
                                        return res.status(400).json({
                                            success: false,
                                             message: 'confirm password not matched'
                                        });
                                    }
                            
                                    // Check if super Admin exists
                                    const superAdmin = await userModel.findOne({ _id: superAdmin_id });
                            
                                    if (!superAdmin) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'super admin not found'
                                        });
                                    }
                            
                                    const saltRounds = 10;
                            
                                    // Hash the new password
                                    const hashedPassword = await bcrypt.hash(password, saltRounds);
                            
                                    // Check if old password is valid
                                    const isOldPasswordValid = await bcrypt.compare(oldPassword, superAdmin.password);
                            
                                    if (!isOldPasswordValid) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'old password is incorrect'
                                        })
                                    }
                            
                                    // Update superAdmin's password
                                    superAdmin.password = hashedPassword;                                           
                                    await superAdmin.save();
                            
                                    return res.status(200).json({
                                        success: true,
                                        message: 'superAdmin password changed successfully'
                                    });
                                } catch (error) {
                                    return res.status(500).json({
                                        success: false,
                                        server_message: 'server error',
                                        message: error.message
                                    });
                                }
                            }
    




                                                      /*  Hotel manager Section */

        // Api for create Hotel Manager

        const createHotel_manager = async (req, res) => {
            try {
                const { name, email, password, contact_no , userType } = req.body;
        
                // Check for required fields
                const requiredFields = ['name', 'email', 'password', 'contact_no' , 'userType'];
        
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
        
                // Check for manager existence
                const existManager = await userModel.findOne({ email : email });
                if (existManager) {
                    return res.status(400).json({
                        success: false,
                        message: 'email already exists'
                    });
                }
        
                // Generate manager_id
                const randomNumber = generateRandomNumber(4);
                const managerId = `Mngr${randomNumber}`;
        
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);
                const profileImage = req.file.filename
        
                // Save manager data
                const newData = new userModel({
                    name,
                    email,
                    password: hashedPassword,
                    contact_no,
                    manager_id: managerId,
                    status: 1,
                    userType : userType,
                    profileImage : profileImage
                });
        
                await newData.save();
        
                // Prepare email content for the manager
                const managerEmailContent = `
                <p>Congratulations! You have been added as a Hotel Manager.</p>
                <p>Here are your account details:</p>
                <table style="border-collapse: collapse; width: 50%; margin: auto; border: 1px solid #4CAF50; border-radius: 10px;">
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Email:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Password:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${password}</td>
                </tr>
                <tr>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd; font-weight: bold;"><strong>Manager ID:</strong></td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${managerId}</td>
                </tr>
            </table>
            `;


        
                // Send email to the manager
                await sendManagerRegisterEmail (newData.email, `Congratulations! You are added as Hotel Manager`, managerEmailContent);
               
                return res.status(200).json({
                    success: true,
                    message: 'New Hotel Manager created successfully',
                    manager_id: managerId
                });
            } catch (error) {
                console.error('Error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
        
        // Function to generate a random number
        function generateRandomNumber(length) {
            let result = '';
            const characters = '0123456789';
            const charactersLength = characters.length;
        
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        
            return result;
        }
        

         // Api for login Hotel Manager
    const hotel_managerLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
    
            // Check for manager email
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: 'Manager email is required'
                });
            }
    
            // Check for password
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: 'Password is required'
                });
            }
    
            // Check for Hotel Manager
            const hotelManager = await userModel.findOne({
                email: email,
            
            });

    
            if (!hotelManager) {
                return res.status(400).json({
                    success: false,
                    message: 'No Hotel Manager found with this email'
                });
            }
            if (hotelManager.status === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Your account is suspended. Please contact the Super admin for further details.'
                });
            }
    
            // Check for password validity
            const isPasswordValid = await bcrypt.compare(password, hotelManager.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Incorrect password'
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Hotel Manager logged in successfully',
                    hotelManager_Details : hotelManager
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
        // Api for get all HotelManager
               const getAll_HotelManager = async( req , res) =>{
                try {
                        // check for all Hotel Manager
                const all_HotelManager = await userModel.find({ userType : "HotelManager" })
                if(!all_HotelManager)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'No Hotel Manager Details found'
                    })
                }
                else
                {
                    return res.status(200).json({
                         success : true , 
                         message : 'All Hotel Manager Details',
                         manager_Details : all_HotelManager
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
    // Api for get particular Hotel Manager Details
                 const get_HotelManager = async(req ,res)=>{
                    try {
                            const manager_id = req.params.manager_id
                            // check for manager_id
                        if(!manager_id)
                        {
                            return res.status(400).json({
                                  success : false,
                                  message : 'manager Id required'
                            })
                        }
                        // check for manager 
                         const HotelManager = await userModel.findOne({ manager_id : manager_id })
                         if(!HotelManager)
                         {
                            return res.status(400).json({
                                   success : false,
                                   message : 'Hotel Manager not found'
                            })
                         }

                            return res.status(200).json({
                                    success : true,
                                   message : 'Hotel Manager Details',
                                   HotelManager_Details : HotelManager
                            })
                        
                    } catch (error) {
                        return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message 
                        })
                    }
                 } 


        // Api for update particular Hotel Manager Details

                 const update_HotelManager = async( req , res)=>{
                    try {
                        const manager_id = req.params.manager_id
                       const { name ,  email  , contact_no   } = req.body

                       // check for manager_id
                       if(!manager_id)
                       {
                        return res.status(400).json({
                              success : false ,
                              message : 'manager_id required'
                        })
                       }

                       // check for Hotel Manager
                       const HotelManager = await userModel.findOne({ manager_id : manager_id })

                       if(!HotelManager)
                       {
                        return res.status(400).json({
                               success : false ,
                               message : 'No Hotel Manager Found'
                        })
                       }
                         const profileImage = req.file.filename

                         HotelManager.name = name
                         HotelManager.email = email
                         HotelManager.contact_no = contact_no
                         HotelManager.profileImage = profileImage

                         await HotelManager.save()
                         return res.status(200).json({
                                success : true ,
                                message : 'Hotel Manager Details updated'
                         })

                    } catch (error) {
                        return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                        })
                    }       
                    
                        }

        //Api for delete particular Hotel Manager
        const delete_particular_Hotel_manager = async (req, res) => {
            try {
                const manager_id = req.params.manager_id;
        
                // Check if manager_id is provided
                if (!manager_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'manager_id required'
                    });
                }
        
                // Find the Hotel Manager
                const hotelManager = await userModel.findOne({ manager_id });
        
                // If Hotel Manager not found, return error
                if (!hotelManager) {
                    return res.status(400).json({
                        success: false,
                        message: 'Hotel manager not found'
                    });
                }
        
                // Check if the Hotel Manager is assigned to any hotel
                const isHotelManagerFound = await HotelModel.findOne({ manager_id });
        
                // If Hotel Manager is associated with a hotel, return error
                if (isHotelManagerFound) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot delete the Hotel Manager because they are associated with Hotel ${isHotelManagerFound.Hotel_name
                        } at ${isHotelManagerFound.address}`
                    });
                }
        
                // If Hotel Manager is not associated with any hotel, delete them
                await hotelManager.deleteOne();
        
                return res.status(200).json({
                    success: true,
                    message: 'Hotel Manager deleted successfully'
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        }
        

                                          /*  Hotel Section */
        
        //Api for create Hotel

        const create_Hotel = async (req, res) => {
            try {
                const { Hotel_name, address, aboutHotel, hotelType, city, facilities, manager_id , commision_rate } = req.body;
        
                // Check for required fields
                const requiredFields = ['Hotel_name', 'address', 'hotelType', 'aboutHotel', 'city', 'facilities', 'manager_id' , 'commision_rate'];
                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`
                        });
                    }
                }
        
                // Check for manager
                const checkManager = await userModel.findOne({ manager_id: manager_id });
                if (!checkManager) {
                    return res.status(400).json({
                        success: false,
                        message: 'Hotel manager not found'
                    });
                }
        
                // Check if the hotel already exists
                const existsHotel = await HotelModel.findOne({ address, Hotel_name });
                if (existsHotel) {
                    return res.status(400).json({
                        success: false,
                        message: `Hotel already exists at the same location`
                    });
                }
        
                // extract manager email
                const email = checkManager.email;
        
                // Check if manager_id is already assigned to a hotel
                const existingManagerHotel = await HotelModel.findOne({ manager_id });
                if (existingManagerHotel) {
                    return res.status(400).json({
                        success: false,
                        message: `Manager already assigned to another hotel`
                    });
                }
        
                // Process and store multiple image files
                const imagePaths = [];
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Please upload at least one Hotel image'
                    });
                } else {
                    req.files.forEach(file => {
                        imagePaths.push(file.filename);
                    });
                }
        
                // Parse facilities if provided
                let Hotel_Facilities = [];
                if (facilities) {
                    try {
                        Hotel_Facilities = JSON.parse(facilities);
                    } catch (error) {
                        return res.status(400).json({
                            success: false,
                            message: 'Invalid facilities format, please provide valid JSON string'
                        });
                    }
                }
        
                // Generate a random Hotel_Id
                function generateRandomNumber(length) {
                    let result = '';
                    const characters = '0123456789';
                    const charactersLength = characters.length;
        
                    for (let i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }
        
                const randomNumber = generateRandomNumber(3);
                const finalString = `Htl${randomNumber}`;
        
                // Create a new hotel document
                const newHotel = new HotelModel({
                    Hotel_Id: finalString,
                    Hotel_name,
                    address,
                    hotelType,
                    aboutHotel,
                    facilities: Hotel_Facilities,
                    manager_id,
                    city,
                    status: 1,
                    HotelImages: imagePaths,
                    floors: [],
                    commision_rate : commision_rate
                   
                });
        
                await newHotel.save();
        
                // Prepare email content for the manager
                const managerEmailContent = `
                    <p>Congratulations! You have been added as a Hotel Manager in Hotel ${Hotel_name}.</p>
                    <p>Here are your account details:</p>
                    <table style="border-collapse: collapse; width: 50%; margin: auto; border: 5px solid #4CAF50; border-radius: 10px;">
                        <tr>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold;"><strong>Hotel Name</strong></td>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">${Hotel_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold;"><strong>City:</strong></td>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">${city}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold;"><strong>Hotel Address:</strong></td>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">${address}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd; font-weight: bold;"><strong> Your Manager_id:</strong></td>
                            <td style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">${manager_id}</td>
                        </tr>
                    </table>
                `;
        
                // Send email to the manager
                await sendManagerRegisterEmail(email, `Congratulations!`, managerEmailContent);
        
                return res.status(200).json({
                    success: true,
                    message: 'Hotel Created Successfully',
                    Hotel_Id: newHotel.Hotel_Id
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Server Error',
                    error_message: error.message
                });
            }
        };
        
        
    // Api for get all Hotels 
               const getAllHotels = async( req , res) =>{
                try {
                       // check for all Hotels
                       const all_Hotels = await HotelModel.find({ })
                       if(!all_Hotels)
                       {
                        return res.status(400).json({
                               success : false , 
                               message : 'no Hotels found'
                        })
                       }
                       else
                       {
                         return res.status(200).json({
                              success : true , 
                              message : 'All Hotels',
                              Hotels_details : all_Hotels
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
          
    // Api for get particular Hotel Details
              
                   const getHotel = async( req , res)=>{
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

                          // check for Hotel
                          const getHotel_Details = await HotelModel.findOne({ Hotel_Id : Hotel_Id })
                          if(!getHotel_Details)
                          {
                            return res.status(400).json({
                                 success : false,
                                 message : 'no Hotel found'
                            })
                          }
                          else
                          {
                            return res.status(200).json({
                                 success : true , 
                                 message : 'Hotel Details',
                                 Hotel_details : getHotel_Details
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

    // Update particular Hotel
                    const updateHotel = async (req, res) => {
                        try {
                            const Hotel_Id = req.params.Hotel_Id;
                            const { Hotel_name, address, hotelType , aboutHotel } = req.body;
                    
                            // Check for Hotel_Id
                            if (!Hotel_Id) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'Hotel_Id required'
                                });
                            }
                    
                            // Check for Hotel
                            const Hotel = await HotelModel.findOne({ Hotel_Id : Hotel_Id });
                            if (!Hotel) {
                                return res.status(400).json({
                                    success: false,
                                    message: 'Hotel not found'
                                });
                            }
                    
                            // Update Hotel Images
                            if (req.files && req.files.length > 0) {
                                const HotelImages = [];
                    
                                for (const file of req.files) {
                                    // Ensure that the file is an image
                                    if (file.mimetype.startsWith("image/")) {
                                        // If the Hotel Images already exist, delete the old file if it exists
                                        if (Hotel.HotelImages && Hotel.HotelImages.length > 0) {
                                            for (const oldFileName of Hotel.HotelImages) {
                                                const oldFilePath = `uploads/${oldFileName}`;
                                                if (fs.existsSync(oldFilePath)) {
                                                    fs.unlinkSync(oldFilePath);
                                                }
                                            }
                                        }
                                        // Add the new HotelImages filename to the HotelImages array
                                        HotelImages.push(file.filename);
                                    }
                                }
                                // Update the images with the new one(s) or create a new one if it doesn't exist
                                Hotel.HotelImages = HotelImages;
                            }
                    
                            // Update the details of Hotel
                            Hotel.Hotel_name = Hotel_name;
                            Hotel.address = address;
                            Hotel.hotelType = hotelType;
                            Hotel.aboutHotel = aboutHotel;
                    
                            // Save changes to the database
                            await Hotel.save();
                    
                            return res.status(200).json({
                                success: true,
                                message: 'Hotel updated successfully'
                            });
                        } catch (error) {
                            return res.status(500).json({
                                success: false,
                                message: 'Server error',
                                error_message: error.message
                            });
                        }
                    };


    // Api for active inactive Hotel
             
    const active_inactive_Hotel = async (req, res) => {
        try {
            const Hotel_Id = req.params.Hotel_Id;
            const today = new Date()
            today.setHours(0, 0, 0, 0);
            
            // Check for Hotel_Id
            if (!Hotel_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel_Id required'
                });
            }
    
            // Check for Hotel
            const Hotel = await HotelModel.findOne({ Hotel_Id: Hotel_Id });
            if (!Hotel) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel not found'
                });
            }                                       
    
            // Check if any room is booked for future dates within the range of check-in to check-out
            const futureBookings = await bookedRoomModel.find({                           
                Hotel_Id: Hotel_Id,
                $and: [
                    // Check if today's date falls between check-in and check-out dates
                    { checkIn: { $lte: today } },
                    { checkOut: { $gte: today } }
                ]
            });

    
            if (futureBookings && futureBookings.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot inactivate Hotel, some rooms are booked here for future dates`
                });
            }
    
            // Toggle Hotel status
            let newStatus = Hotel.status === 1 ? 0 : 1;
    
            // Update Hotel status
            await HotelModel.findOneAndUpdate({ Hotel_Id: Hotel_Id }, { status: newStatus });
    
            return res.status(200).json({
                success: true,
                message: `Hotel ${newStatus ? 'activated' : 'inactivated'} successfully`
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    
                    
                      
                                    
                                                          /*  floor and Room Section */

         // APi for add rooms in Hotel floor

         const addRooms = async (req, res) => {
            try {
                var { Hotel_Id } = req.params;
                var { floor_Number, rooms } = req.body;
        
                // Check for Hotel_Id
                if (!Hotel_Id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Hotel_Id required'
                    });
                }
                floor_Number = parseInt(floor_Number);
                  

                // Check for floor_Number
                if (!floor_Number && floor_Number !== 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'floor_Number required'
                    });
                }
        
                // Check for rooms
                if (!rooms || rooms.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Rooms details required'
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
        
                // Find the floor based on floor_Number
                let floorIndex = hotel.floors.findIndex(floor => floor.floor_Number === floor_Number);
        
                // If floor doesn't exist, create it
                if (floorIndex === -1) {
                    // Create new floor
                    hotel.floors.push({ floor_Number, rooms: [] });
                    floorIndex = hotel.floors.length - 1; // Index of newly added floor
                }
        
                // Adjust room_number according to floor_Number
                let startingRoomNumber;
                if (floor_Number === 0) {
                    startingRoomNumber = 1;
                } else {
                    startingRoomNumber = (parseInt(floor_Number) * 100) + 1;
                }
        
                // Validate room numbers and check for duplicates
                const existingRoomNumbers = new Set(hotel.floors[floorIndex].rooms.map(room => room.room_number));
                for (const room of rooms) {
                    const roomNumber = parseInt(room.room_number);
                    if (roomNumber < startingRoomNumber || roomNumber >= startingRoomNumber + 100) {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid room_number ${room.room_number} for floor ${floor_Number}`
                        });
                    }
                    if (existingRoomNumbers.has(room.room_number)) {
                        return res.status(400).json({
                            success: false,
                            message: `Room ${room.room_number} already exists on floor ${floor_Number}`
                        });
                    }
                    existingRoomNumbers.add(room.room_number);
                }
        
                // Add rooms to the specified floor
                hotel.floors[floorIndex].rooms.push(...rooms);
        
                // Update the hotel document with the modified floors
                await hotel.save();
        
                return res.status(200).json({
                    success: true,
                    message: 'Rooms added successfully to floor ' + floor_Number
                });

               

            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message: error.message
                });
            }
        };
        
        
     // Api for get all floors of the Hotel
     const getAll_floors_wise_Rooms_of_Hotel = async (req, res) => {
        try {
            const { Hotel_Id } = req.params;
    
            // Check for Hotel_Id 
            if (!Hotel_Id) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel_Id required'
                });
            }
    
            // Find the Hotel
            const hotel = await HotelModel.findOne({ Hotel_Id });
    
            // Check if Hotel exists
            if (!hotel) {
                return res.status(400).json({
                    success: false,
                    message: 'No Hotel Found'
                });
            }
    
            // Extract floor details
            const floorDetails = hotel.floors.map(floor => ({
                floor_Id: floor._id,
                floor_Number: floor.floor_Number,
                rooms : floor.rooms                
            }));
    
            return res.status(200).json({
                success: true,
                message : 'all floor with there specific Rooms ',
                floors: floorDetails
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message : error.message
            });
        }
    };

  // Api for Dashboard counts

       const Dashboard_all_count = async( req , res)=>{
        try {
               // check for hotelmanagers

               const hotelManager = await userModel.find({
                userType : 'HotelManager',
                status : 1
               })
               if(!hotelManager)
               {
                return res.status(400).json({
                     success : false ,
                     message : 'No Hotel Manager Found'
                })
               }

               // check for subAdmin
               const subAdmin = await userModel.find({
                  userType : 'sub_Admin',
                  status : 1
               })

               if(!subAdmin)
               {
                return res.status(400).json({
                     success : false ,
                     message : 'No Sub-admin Found'
                })
               }

               // check for Hotels

               const hotels = await HotelModel.find({
                   status : 1
                })

               if(!hotels)
               {
                return res.status(400).json({
                     success : false ,
                     message : 'No Hotels Found'
                })
               }


               // check for bookings

               const bookings = await bookedRoomModel.find({
                     status : 'confirmed'
               })

               if(!bookings)
               {
                return res.status(400).json({
                     success : false ,
                     message : 'No bookings Found'
                })
               }

               return res.status(200).json({
                    success : true ,
                    message : 'Dashboard Details',
                    HotelManagers : hotelManager.length,
                    SubAdmin : subAdmin.length,
                    Hotels : hotels.length,
                    bookings : bookings.length                  

               })

        } catch (error) {
            return res.status(400).json({
                 success : false ,
                 message : 'server error',
                 error_message : error.message
            })
        }
       }
            

                                                    /* Privacy Policy Section */
                              
         // Api for get all Hotel privacy and policy
         const getAllPrivacy_policy = async( req , res)=>{
            try {
                 // check for all Hotels privacy and policy
            const AllPrivacy_policy = await privacy_policyModel.find({ })
            if(!AllPrivacy_policy)
            {
                return res.status(400).json({
                       success : false , 
                       message : 'no privacy and policy found'
                })
            }
            return res.status(200).json({
                  success : true , 
                  message : 'all Hotels privacy & policy ',
                  Details : AllPrivacy_policy
            })
            } catch (error) {
                return res.status(500).json({
                       success : false , 
                       message : 'server error',
                       error_message : error.message
                })
            }
         }
        
                                                 /* Term & Condition Section */
            // APi for Hotels term & condition
       const AllTerm_condition = async( req , res) =>{
        try {
                // check for All Term & condition
            const getAllTerm_condition = await term_conditionModel.find({ })
            if(!getAllTerm_condition)
            {
                return res.status(400).json({
                        success : false , 
                        message : 'no term and condition details found'
                })
            }
             return res.status(200).json({
                  success : true , 
                  message : 'All Hotel Term & Conditions',
                  Details : getAllTerm_condition
             })
        } catch (error) {
            return res.status(500).json({
                    success : false , 
                    message : "server error",
                    error_message : error.message
            })
        }
       }

                                                     /* Ratings and Reviews of Hotels */
                                                     
    // Api for get all Hotels Rating and Reviews
    
            const getAllHotels_Rating_Reviews = async( req , res)=>{
                    try {
                            // check for all Hotels Ratings and Reviews
                        const all_Hotels_RR = await rating_review_Model.find({ })
                        if(!all_Hotels_RR)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no Ratings and reviews Found for the Hotels'
                            })
                        }
                         return res.status(200).json({
                                  success : true , 
                                  message : 'All Hotels Rating and Reviews',
                                  Details : all_Hotels_RR
                         })
                    } catch (error) {
                        return res.status(500).json({
                              success : false , 
                              message : 'server error',
                              error_message : error.message
                        })
                    }
            }
                                            
                                             /* Notification Section */

        // API to send Notification to all Customer
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
            

        // Api to send notification to particular customer
        const sendNotification_to_customer = async (req, res) => {
            try {
                const { customerId, title, message  } = req.body;

                // Validate input fields
                const requiredFields = [ 'title', 'message'];

                for (const field of requiredFields) {
                    if (!req.body[field]) {
                        return res.status(400).json({
                            success: false,
                            message: `Missing ${field.replace('_', ' ')} field`,
                        });
                    }
                }
                if(!customerId)
                {
                  return res.status(400).json({
                                 success : false ,
                                 userValidationMessage : 'select customer for send notification not found'
                  })
                }

                // Get the customer by customerId
                const customer = await customerModel.findOne({ _id : customerId } );
                       
                if (!customer) {
                    return res.status(400).json({
                        success: false,
                        message: 'customer not found',
                    });
                }

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

                // Save a single record in UsersNotificationModel
                const savedNotification = await customer_NotificationModel.create({
                    customerId: customer._id,
                    title,
                    message,                 
                    customerEmail: customer.email,
                    customerName: customer.customerName,
                    status : 1

            
                });

                return res.status(200).json({
                    success: true,
                    message: 'Notification sent ',
                    notification_details: savedNotification,
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                    error_message : error.message
                });
            }
        };

   // API to send Notification to all Customer
   const sendNotification_to_allHotels = async (req, res) => {
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

        // Get all Hotels
        const Hotels = await HotelModel.find({});

        if (Hotels.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'There is no Hotel found',
            });
        }

        const notifications = [];
        // Send the same notification email to all hotels
        for (const Hotel of Hotels) {
            // Get the manager's ID for the current hotel
            const managerId = Hotel.manager_id;
            // Fetch the manager's details
            const manager = await userModel.findOne({ manager_id : managerId });
            const managerEmail = manager.email;
            const managerName = manager.name;

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
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">Dear ${managerName},</p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">Greetings of the Day,</p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Title:</strong> <span style="color: #FF5733;">${title}</span></p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;"><strong>Message:</strong> <span style="color: #3366FF;">${message}</span></p>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">If you have any questions, feel free to contact us.</p>
                    </div>
                
                </body>
                </html>
            `;

            // Send email notification to the manager
            await notificationEmail(managerEmail, 'Notification', messageContent);

            // Save notification record for the hotel
            const savedNotification = new Hotel_NotificationModel({
                title,
                message,
                date: new Date(),
                Hotel_Id: Hotel.Hotel_Id,
                managerEmail,
                managerName
            });

            notifications.push(savedNotification);
            savedNotification.save()
        }

        return res.status(200).json({
            success: true,
            message: 'Notifications sent',
            notification_details: notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error_message: error.message
        });
    }
};

    

    // API to send notification to all customers and particular one according to Superadmin choice

            const sendNotifications = async (req, res) => {
                try {
                    const superAdmin_Id = req.params.superAdmin_Id
                    // check for superAdmin Id
                    if(!superAdmin_Id)
                    {
                        return res.status(400).json({
                               success : false ,
                               message : 'superAdmin Id required'
                        })
                    }

                    // check for super admin
                    const superAdmin = await userModel.findOne({
                            _id : superAdmin_Id,
                            userType : "Super_Admin"
                    })

                    if(!superAdmin)
                    {
                        return res.status(400).json({
                             success : false ,
                             message : 'super admin not found'
                        })
                    }
                  const super_adminChoice = req.body.super_adminChoice;
              
                  let notificationFunction;
              
                  if (super_adminChoice === 1) {
                    notificationFunction = sendNotification_to_customer;
                  } else if (super_adminChoice === 2) {
                    notificationFunction = sendNotification_to_allCustomer;
                  } 
                    else if (super_adminChoice === 3)
                    {
                        notificationFunction = sendNotification_to_allHotels;
                    } 
                  else {
                    return res.status(400).json({
                      success: false,
                      InvalidChoiceMessage: " Please select one option",
                    });
                  }
              
                  // Call the selected notification function
                  await notificationFunction(req, res);
              
                  // Only send the success response if the notification function didn't send a response
                  if (!res.headersSent) {
                    return res.status(200).json({
                      success: true,
                      NotificationSentMessage: 'Notification sent',
                    });
                  }
                } catch (error) {
                 
                  if (!res.headersSent) {
                    return res.status(500).json({
                      success: false,
                      message : 'Server error',
                      error_message : error.message
                    });
                  }
                }
              };


    // Api for get all Notifications Details

                      const getAllNotifications = async(req ,res)=>{
                        try {
                               // check for Notfications
                            const notifications_of_customers = await customer_NotificationModel.find({ })
                            const notifcations_of_hotels = await Hotel_NotificationModel.find({ })

                            const notifications = [...notifcations_of_hotels, ...notifications_of_customers]
                            if(!notifications)
                            {
                                return res.status(400).json({
                                        success : false ,
                                        message : 'no notification found'
                                })
                            }
                             return res.status(200).json({
                                    success : true ,
                                    message : 'all Notifications Details',
                                    Details : notifications
                             })
                        } catch (error) {
                            return res.status(500).json({
                                    success : false ,
                                    message : 'server error',
                                    error_message : error.message
                            })
                        }
                      }
         

                                                     /*  PROMO code and coupon */
        
        
            // Api for create Promo code 
            const create_promo_code = async (req, res) => {
                try {
                   
                    const { offer_title, offer_description, promo_code, discount, start_Date, end_Date , limit } = req.body;
            
                    
                    // Check for required fields
                    const requiredFields = { offer_title, offer_description, promo_code, discount, start_Date, end_Date , limit };
                    for (const [field, value] of Object.entries(requiredFields)) {
                        if (!value) {
                            return res.status(400).json({
                                success: false,
                                message: `Missing ${field.replace('_', ' ')} field`
                            });
                        }
                    }
            
                    // Check for existing promo code
                    const exist_promo_code = await promo_Coupon_Model.findOne({
                        promo_code: promo_code,
                        start_Date: { $lte: new Date(new Date(end_Date).getTime() + 24 * 60 * 60 * 1000) },
                        end_Date: { $gte: new Date(start_Date) }
                    });
            
                    if (exist_promo_code) {
                        return res.status(400).json({
                            success: false,
                            message: `Promo code : ${promo_code} , already exists within the same duration of start date & end date`
                        });
                    }
            
                    // Create new promo code
                    const new_promo = new promo_Coupon_Model({
                        offer_title,
                        offer_description,
                        promo_code,
                        discount,
                        start_Date,
                        end_Date,
                        limit
                    });
            
                    await new_promo.save();


                    const all_customer = await customerModel.find({ })

                    const formatDate = (dateString) => {
                      return new Date(dateString).toISOString().slice(0, 10);
                  };
                  
                  const formattedStartDate = formatDate(start_Date);
                  const formattedEndDate = formatDate(end_Date);
                  
          
                   const emailContent = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    </head>
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <div style="background-color: #4CAF50; color: white; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0;">New Promotional Offer!</h1>
                            </div>
                            <div style="padding: 20px; text-align: left; color: #333333;">
                                <p>Hello,</p>
                                <p>We are excited to announce a new promotional offer!</p>
                                <div style="margin: 20px 0; padding: 10px; border-left: 4px solid #4CAF50; background-color: #f9f9f9;">
                                    <p><strong>Offer Title:</strong> ${offer_title}</p>
                                    <p><strong>Description:</strong> ${offer_description}</p>
                                    <p><strong>Promo Code:</strong> ${promo_code}</p>
                                    <p><strong>Discount:</strong> ${discount}%</p>
                                    <p><strong>Valid From:</strong> ${formattedStartDate}</p>
                                    <p><strong>To:</strong> ${formattedEndDate}</p>
                                </div>
                                <p>Hurry up and make the most of this offer!</p>
                            </div>                            
                        </div>
                    </body>
                    </html>
                    `;
                    
                    
                    
              for (const customer of all_customer) {
                promoCodeEmail ( customer.email , 'New promoCode Available' , emailContent )
              }
            
                    return res.status(200).json({
                        success: true,
                        message: 'New promo code created'
                    });
            
                } catch (error) {
                    return res.status(500).json({
                        success: false,
                        message: 'Server error',
                        error_message: error.message
                    });
                }
            };

        
        
    // Api for get promo code
    const get_promo_codes = async (req, res) => {
        try {
            const today = new Date();
    
            // Retrieve promo codes with a start date in the future or an end date in the future or today
            const upcomingPromos = await promo_Coupon_Model.find({
                $or: [
                    { start_Date: { $gte: today } },
                    { end_Date: { $gte: today } }
                ]
            }).sort({ start_Date: 1 });
    
            if (upcomingPromos.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No upcoming promo codes found'
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'Upcoming promo codes',
                promo_codes: upcomingPromos
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    
    // Api for update particular promo code
    const update_promo_code = async (req, res) => {
        try {
            const promo_code_id = req.params.promo_code_id;
            const { offer_title, offer_description, discount, promo_code} = req.body;
    
            // Check for promo code Id
            if (!promo_code_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code ID required'
                });
            }
    
            // Check for promo code existence
            const check_promo_code = await promo_Coupon_Model.findOne({ _id : promo_code_id });
            if (!check_promo_code) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code not found'
                });
            }
    
            // Check if promo code is expired
            const today = new Date();
            if (today > check_promo_code.end_Date) {
                return res.status(400).json({
                    success: false,
                    message: "Promo code is expired, you can't update it"
                });
            }
    
            // Update fields if provided
            check_promo_code.offer_title = offer_title;
            check_promo_code.offer_description = offer_description;
            check_promo_code.discount = discount;
            check_promo_code.promo_code = promo_code;
            check_promo_code.limit = limit;
            
            // Save the updated promo code
            await check_promo_code.save();
    
            return res.status(200).json({
                success: true,
                message: 'Promo code updated successfully',
                
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
    


    // Api for delete promo code

     const delete_promo_code = async ( req , res )=>{
             try {
           const promo_code_id = req.params.promo_code_id
             // check for promo code id
             if(!promo_code_id)
                {
                    return res.status(400).json({
                           success : false ,
                           message : 'promo_code_id required'
                    })
                }

            // check for promo code

            const check_promo_code = await promo_Coupon_Model.findOne({
                   _id :  promo_code_id
            })

            if(!check_promo_code)
                {
                    return res.status(400).json({
                          success : false ,
                          message : 'promo code not found'
                    })
                }

                await check_promo_code.deleteOne()

            return res.status(200).json({
                       success : true ,
                       message : 'promo code deleted successfully'
            })
             } catch (error) {
                return res.status(500).json({
                     success : false ,
                     message : 'server error',
                     error_message : error.message
                })
             }
     }

        
    // Api for get  commision from the particular Hotel
    const get_commission_from_hotel = async (req, res) => {
        try {
            const hotelId = req.params.hotelId;
            const { start_Date, end_Date } = req.body;

            if(!start_Date)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'start Date required'
                    })
                }
    
            if(!end_Date)
                {
                    return res.status(400).json({
                         success : false ,
                         message : 'end_Date required'
                    })
                }
    
            // Check if hotelId is provided
            if (!hotelId) {
                return res.status(400).json({
                    success: false,
                    message: 'Hotel Id required'
                });
            }
    
            // Check if hotel exists
            const check_hotel = await HotelModel.findOne({ Hotel_Id: hotelId });
            if (!check_hotel) {
                return res.status(400).json({
                    success: false,
                    message: 'No Hotel found'
                });
            }
    
            // Find bookings within the given date range for the specified hotel
            const bookings = await bookedRoomModel.find({
                Hotel_Id: hotelId,
                checkIn : { $gte: start_Date, $lte: end_Date }
            });
                 // Sum up commission prices from the bookings
                let totalCommission = 0;
                bookings.forEach(booking => {
                    // Add commission price of each booking to the total
                    totalCommission += booking.commision_price;
                });
    
            // Send the commissions as response
            return res.status(200).json({
                success: true,
                commision : `commision from Hotel : ${hotelId} is : ${totalCommission}`
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
                error_message: error.message
            });
        }
    };
             

    // Api for get total commissoin
             const get_total_commission = async ( req , res ) => {
                     try {
                         // check for all hotel booking
                      const check_all_booking = await bookedRoomModel.find({ })

                      if(!check_all_booking)
                        {
                            return res.status(400).json({
                                 success : false ,
                                 message : 'no booking found'
                            })
                        }

                        let totalCommission = 0;
                        check_all_booking.forEach(booking => {
                            // Add commission price of each booking to the total
                            totalCommission += booking.commision_price;
                        })

                          return res.status(200).json({
                                 success : true ,
                                 message : 'total commission',
                                 total_commission : totalCommission
                          })


                     } catch (error) {
                         return res.status(500).json({
                             success : false ,
                             message : 'server error',
                             error_message : error.message
                         })
                     }
             } 
            

                                                          /*  CMS Section */
                                                          

module.exports = {

    login , getsuperAdmin , updateSuperAdmin_details , superAdmin_change_password , createHotel_manager,
    getAll_HotelManager , get_HotelManager , update_HotelManager , delete_particular_Hotel_manager, create_Hotel,
    getAllHotels , getHotel , updateHotel , active_inactive_Hotel , addRooms , getAll_floors_wise_Rooms_of_Hotel ,
     hotel_managerLogin , Dashboard_all_count , getAllPrivacy_policy , AllTerm_condition , getAllHotels_Rating_Reviews,
     sendNotification_to_allCustomer , sendNotification_to_customer ,sendNotification_to_allHotels, sendNotifications,
     getAllNotifications , create_promo_code , get_promo_codes , update_promo_code , delete_promo_code , get_commission_from_hotel,
     get_total_commission
}