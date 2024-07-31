const express = require('express')
const router = express.Router()
const upload = require('../upload')

const HotelManagerController = require('../controller/HotelmanagerController')



                                    /*  Hotel Manager section */

    
    // APi for get Hotel manager 's Hotel
                 router.get('/get_Hotels_of_HotelManager/:manager_id', HotelManagerController.get_Hotels_of_HotelManager)
    

                                    /*Hotel section */
    // APi for updateRoom
                  router.put('/updateRoom/:Hotel_Id/:room_number', HotelManagerController.updateRoom)
    // APi for active_inactive_Room
                router.post('/active_inactive_Room/:Hotel_Id/:room_number', HotelManagerController.active_inactive_Room)

                                      /*  Hotel Booking Section */
    // Api for getAll_pending_Booking_Request
                 router.get('/getAll_pending_Booking_Request', HotelManagerController.getAll_pending_Booking_Request)
    // Api for getHotelRoom_floorwise
                  router.get('/getHotelRoom_for_pending_bookings/:Hotel_Id', HotelManagerController.getHotelRoom_for_pending_bookings)
    // Api for assingRoom_to_booking
                 router.post('/assingRoom_to_booking/:booking_Id', HotelManagerController.assingRoom_to_booking)
    // APi for getAllBookings_of_Hotel
                  router.get('/getAllBookings_of_Hotel/:Hotel_Id', HotelManagerController.getAllBookings_of_Hotel)
    // Api for particular booking 
                   router.get('/searchBooking/:booking_Id', HotelManagerController.searchBooking)



                                         /* privacy and policy */
    // APi for privacy and policy
                  router.post('/privacyAndPolicy/:Hotel_Id', HotelManagerController.privacyAndPolicy)
    // Api for getPrivacy_policy
                  router.get('/getPrivacy_policy/:Hotel_Id', HotelManagerController.getPrivacy_policy)

                                        /* Term & condition Section */

    // Api for term_condition
                  router.post('/term_condition/:Hotel_Id', HotelManagerController.term_condition)
    // APi for getHotel_term_condition
                  router.get('/getHotel_term_condition/:Hotel_Id', HotelManagerController.getHotel_term_condition)

                                      /* complain Section */
    // Api for getAllComplains
                  router.get('/getAllComplains', HotelManagerController.getAllComplains)

                                         /* Rating and Reviews section */
    // Api for getRating_Reviews
                  router.get('/getRating_Reviews/:Hotel_Id', HotelManagerController.getRating_Reviews)

                                       /* Notifications */
    // Api for getHotel_notificaition
                  router.get('/getHotel_notificaition/:Hotel_Id', HotelManagerController.getHotel_notificaition)
    // Api for seen_Hotel_notification
                   router.get('/seen_Hotel_notification/:notification_id', HotelManagerController.seen_Hotel_notification)
    // APi for sendNotification_to_allCustomer
                   router.post('/sendNotification_to_allCustomer', HotelManagerController.sendNotification_to_allCustomer)

                                   /* Exports and Imports */
    // Api for export_all_bookings_of_hotel
                   router.get('/export_all_bookings_of_hotel/:Hotel_Id', HotelManagerController.export_all_bookings_of_hotel)

                    
                                  /*   Transaction section */
    // Api for get_all_transaction_of_hotel
                router.get('/get_all_transaction_of_hotel/:Hotel_Id', HotelManagerController.get_all_transaction_of_hotel)

                                                   /* contact us section */
        // Api for getContact_Details
                router.get('/getContact_Details', HotelManagerController.getContact_Details)
        // Api for delete_contact_detail
                 router.delete('/delete_contact_detail/:contact_id', HotelManagerController.delete_contact_detail)

 
                               




module.exports = router