const express = require('express')
const router = express.Router()
const customerController = require('../controller/customerController')
const upload = require('../upload')


                     /* APi for customer */


// APi for customer register
          router.post('/register_customer', upload.single('profileImage'), customerController.register_customer)
// Api for login
        router.post('/logincustomer', customerController.logincustomer)
// APi for update customer Details
         router.put('/updatecustomer/:customerId', upload.single('profileImage'), customerController.updatecustomer)
// Api for ger particular customer details
         router.get('/getcustomer_Details/:customerId', customerController.getcustomer_Details)
// Api for get all customers
         router.get('/getAllcustomer', customerController.getAllcustomer)
// Api for change customerPassword
        router.post('/customer_change_pass/:customerId', customerController.customer_change_pass)
// Api for delete customer
         router.delete('/deleteCustomer/:customerId', customerController.deleteCustomer)
// Api for active_inactive_customer
        router.post('/active_inactive_customer/:customerId', customerController.active_inactive_customer)


                                  /* Search Hotel and Booking section */

// APi for search Hotel
        router.post('/search_Hotel', customerController.search_Hotel)
// Api for filter hotel
        router.post('/filter_Hotel', customerController.filter_Hotel)

// APi for bookHotel
        router.post('/bookHotel/:hotelId', customerController.bookHotel)
// APi for get my upcoming bookings
        router.get('/getUpcomingBookings/:customerId', customerController.getUpcomingBookings)
// Api for get getRecent_Bookings
        router.get('/getRecent_Bookings/:customerId', customerController.getRecent_Bookings)
// Api for cancleBooking
        router.post('/cancelBooking', customerController.cancelBooking)

                                         /* Complain Section */
// Api for createComplain
        router.post('/createComplain', customerController.createComplain)

                                         /* Rating Review Section */
// Api for createRatingReview
       router.post('/createRatingReview/:customerId/:hotelId',customerController.createRatingReview)

                                        /* Notification */
// APi for customer_Notification
       router.get('/customer_Notification/:customerId', customerController.customer_Notification)
// APi for seen_customer_notification
       router.get('/seen_customer_notification/:notification_id', customerController.seen_customer_notification)

                                          /* Contact us section */

// Api for contact_us
       router.post('/contact_us', customerController.contact_us)



          
    
module.exports = router