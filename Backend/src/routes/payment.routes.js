import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { createOrder, getAllPayments, getPaymentByBookingId, refundPayment, verifyPayment, razorpayWebhook } from '../controllers/payment.controllers.js'

const router = Router()

//User routes
router.route('/create-order').post(verifyJWT, createOrder)
router.route('/verify-payment').post(verifyJWT, verifyPayment)
router.route('/webhook').post(razorpayWebhook)

//Admin routes
router.route('/getAllPayments').get(verifyJWT, isAdmin, getAllPayments)
router.route('/refund/:payment_id').post(verifyJWT, isAdmin, refundPayment)

//User routes
router.route('/:booking_id').get(verifyJWT, getPaymentByBookingId)
export default router