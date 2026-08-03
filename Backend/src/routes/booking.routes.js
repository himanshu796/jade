import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { cancelBooking, createBooking, getAllBookings, getBookingById, getMyBookings, updateBookingStatus, } from '../controllers/booking.controllers.js'

const router = Router()

// User routes
router.route('/createBooking').post(verifyJWT, createBooking)
router.route("/my-bookings").get(verifyJWT, getMyBookings)
router.route('/:booking_id').get(verifyJWT, getBookingById)
router.route("/cancel/:booking_id").patch(verifyJWT, cancelBooking)


// Admin routes
router.route('/').get(verifyJWT, isAdmin, getAllBookings)
router.route('/status/:booking_id').patch(verifyJWT, isAdmin, updateBookingStatus)


export default router