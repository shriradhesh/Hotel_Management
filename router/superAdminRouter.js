const express = require('express')
const router = express.Router()
const upload = require('../upload')
const superAdminController = require('../controller/superAdminController')



// Api for superAdmin_login / HotelManager login  / superAdmin  login
               router.post('/login', superAdminController.login)
// Api for getsuperAdmin
               router.get('/getsuperAdmin/:superAdmin_id', superAdminController.getsuperAdmin)
// Api for updateSuperAdmin_details
               router.put('/updateSuperAdmin_details/:superAdmin_id', upload.single('profileImage'), superAdminController.updateSuperAdmin_details)
// Api for superAdmin_change_password
              router.post('/superAdmin_change_password/:superAdmin_id', superAdminController.superAdmin_change_password)
   

                                   /* Hotel Manager Section */

// Api for createHotel_manager
               router.post('/createHotel_manager', upload.single('profileImage'), superAdminController.createHotel_manager)
// APi for hotel manager login
               router.post('/hotel_managerLogin',  superAdminController.hotel_managerLogin)
// Api for getAll_HotelManager
                router.get('/getAll_HotelManager', superAdminController.getAll_HotelManager)
// Api for get Particular Hotel manager Details
                router.get('/get_HotelManager/:manager_id', superAdminController.get_HotelManager)
// Api for update particular Hotel Manager Details
                router.put('/update_HotelManager/:manager_id', upload.single('profileImage'), superAdminController.update_HotelManager)
// Api for delete_particular_Hotel_manager
                router.delete('/delete_particular_Hotel_manager/:manager_id', superAdminController.delete_particular_Hotel_manager)

                                        /* Hotel Section  */

// Api for create_Hotel
                router.post('/create_Hotel', upload.array('HotelImages', 10 ), superAdminController.create_Hotel)
// Api for getAllHotels
                router.get('/getAllHotels', superAdminController.getAllHotels)
// Api for getHotel
                 router.get('/getHotel/:Hotel_Id', superAdminController.getHotel)
// Api for updateHotel
                 router.put('/updateHotel/:Hotel_Id', upload.array('HotelImages', 10 ) , superAdminController.updateHotel)
// Api for active_inactive_Hotel
                 router.post('/active_inactive_Hotel/:Hotel_Id',superAdminController.active_inactive_Hotel )
 
                                       /* Hotel - floor(rooms) Section */
// Api for addRooms in Hotel
                 router.post('/addRooms/:Hotel_Id', superAdminController.addRooms)
// Api for getAll_floors_of_Hotel
                router.get('/getAll_floors_wise_Rooms_of_Hotel/:Hotel_Id', superAdminController.getAll_floors_wise_Rooms_of_Hotel)

                                    /* Dashboard Section */
// APi for Dashboard_all_count
                 router.get('/Dashboard_all_count', superAdminController.Dashboard_all_count)

                              /* privacy and policy section  */
// Api for getAllPrivacy_policy
                  router.get('/getAllPrivacy_policy', superAdminController.getAllPrivacy_policy)

                               /*  term & condition Section */

// Api for AllTerm_condition
                    router.get('/AllTerm_condition', superAdminController.AllTerm_condition)

                                 /* Rating and Reviews of Hotels */
// Api for getAllHotels_Rating_Reviews
                    router.get('/getAllHotels_Rating_Reviews', superAdminController.getAllHotels_Rating_Reviews)

                                /* Notification section */
// Api for sendNotification_to_allCustomer
                     router.post('/sendNotification_to_allCustomer', superAdminController.sendNotification_to_allCustomer)
// APi for sendNotification_to_customer
                      router.post('/sendNotification_to_customer', superAdminController.sendNotification_to_customer)
// APi for sendNotification_to_allHotels
                      router.post('/sendNotification_to_allHotels', superAdminController.sendNotification_to_allHotels)
// Api for sendNotifications to customers
                      router.post('/sendNotifications/:superAdmin_Id', superAdminController.sendNotifications)
// Api for getAllNotifications
                      router.get('/getAllNotifications', superAdminController.getAllNotifications)

                                    /* promo code & coupon */
// Api for create_promo_code
                      router.post('/create_promo_code', superAdminController.create_promo_code)
// Api for get_promo_codes
                      router.get('/get_promo_codes', superAdminController.get_promo_codes)
// Api for update_promo_code
                       router.put('/update_promo_code/:promo_code_id', superAdminController.update_promo_code)
// Api for delete_promo_code
                       router.delete('/delete_promo_code/:promo_code_id', superAdminController.delete_promo_code)


                                  /* commission */
// ApI for get commission for the particular hotel
                        router.post('/get_commission_from_hotel/:hotelId', superAdminController.get_commission_from_hotel)
// Api for get_total_commission
                        router.get('/get_total_commission', superAdminController.get_total_commission)

                                    /* Dashboard count */
// Api for DashBoard_Count
                        router.get('/DashBoard_Count', superAdminController.DashBoard_Count)
// Api for totalTransactionAmount
                        router.get('/totalTransactionAmount', superAdminController.totalTransactionAmount)
                                     
                                     /* Tranasaction Sections */
// Api for get all_transaction
                        router.get('/all_transaction', superAdminController.all_transaction)
 

module.exports = router



