import razorpay from '../config/razorpay.js'
import prisma from '../config/prismaClient.js'
import crypto from 'crypto'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'


// ************************** Create Order ************************
const createOrder = asyncHandler(async (req, res) => {
    const { booking_id } = req.body

    if (!booking_id) {
        throw new ApiError(400, "Booking id is required")
    }

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
        where: { booking_id: parseInt(booking_id) }
    })
    if (!booking) {
        throw new ApiError(404, "Booking not found")
    }

    // Check if booking belongs to logged in user
    if (booking.userId !== req.user.user_id) {
        throw new ApiError(403, "Access denied")
    }

    // Check if booking is already paid
    const existingPayment = await prisma.payment.findUnique({
        where: { bookingId: parseInt(booking_id) }
    })
    if (existingPayment && ["SUCCESS", "PENDING"].includes(existingPayment.status)) {
        throw new ApiError(409, "Booking already paid")
    }

    // Create Razorpay
    const order = await razorpay.orders.create({
        amount: booking.totalPrice * 100,      //convert to paise
        currency: "INR",
        receipt: `receipt_${booking_id}`
    })

    // Save payment in DB
    const payment = await prisma.payment.create({
        data: {
            bookingId: parseInt(booking_id),
            userId: req.user.user_id,
            amount: booking.totalPrice,
            currency: "INR",
            status: "PENDING",
            razorpayOrderId: order.id
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, {
            order,
            payment,
            key_id: process.env.RAZORPAY_KEY_ID
        }, "Order created successfully"))
})


// ************************* Verify payment *************************
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        throw new ApiError(400, "All fields are required")
    }

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex")

    if (expectedSignature !== razorpaySignature) {
        await prisma.payment.update({
            where: { razorpayOrderId },
            data: { status: "FAILED" }
        })
        throw new ApiError(400, "Payment verification failed")
    }


    // Update payment status to success
    const payment = await prisma.payment.update({
        where: { razorpayOrderId },
        data: {
            status: "SUCCESS",
            razorpayPaymentId,
            razorpaySignature
        }
    })

    // Update booking status to confirmed
    await prisma.booking.update({
        where: { booking_id: payment.bookingId },
        data: { status: "CONFIRMED" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment verified successfully"))
})


// ********************** Get payment by booking id *************************
const getPaymentByBookingId = asyncHandler(async (req, res) => {
    const { booking_id } = req.params

    const payment = await prisma.payment.findUnique({
        where: { bookingId: parseInt(booking_id) },
        include: {
            booking: true
        }
    })

    if (!payment) {
        throw new ApiError(404, "Payment not found")
    }

    // Check if payment belongs to logged in user or admin
    if (payment.userId !== req.user.user_id && req.user.role !== "ADMIN") {
        throw new ApiError(403, "Access denied")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, payment, "Payment fetched successfully"))
})


// *********************** Get all payments (Admin only) *********************
const getAllPayments = asyncHandler(async (req, res) => {
    const { status } = req.query

    const filter = {}
    if (status) filter.status = status

    const payments = await prisma.payment.findMany({
        where: filter,
        include: {
            booking: true,
            user: {
                select: {
                    user_id: true,
                    fullname: true,
                    email: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, payments, "Payments fetched successfully"))
})


// *************************** Refund payment (Admin only) ****************************
const refundPayment = asyncHandler(async (req, res) => {
    const { payment_id } = req.params

    const payment = await prisma.payment.findUnique({
        where: { payment_id: parseInt(payment_id) },
        include: { booking: true }
    })

    if (!payment) {
        throw new ApiError(404, "Payment not found")
    }

    // Check if refund is already given
    if (payment.status === "REFUNDED") {
        throw new ApiError(409, "Payment already refunded")
    }

    // Check if payment is successfull
    if (payment.status !== "SUCCESS") {
        throw new ApiError(400, "Only successfull payments can be refunded")
    }

    // Initiate refund on Razorpay
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: payment.amount * 100     // convert to paise
    })

    // Update payment status to refunded
    const updatedPayment = await prisma.payment.update({
        where: { payment_id: parseInt(payment_id) },
        data: { status: "REFUNDED" }
    })


    // Update booking status to cancelled
    await prisma.booking.update({
        where: { booking_id: payment.bookingId },
        data: { status: "CANCELLED" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, { refund, payment: updatedPayment }, "Payment refunded successfully"))
})


// ******** If the user closes the tab or loses connection right after paying, Razorpay has the money but your DB still says PENDING/FAILED ****************
const razorpayWebhook = asyncHandler(async (req, res) => {
    const signature = req.headers["x-razorpay-signature"]
    const body = req.body

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex")

    if (expectedSignature !== signature) {
        throw new ApiError(400, "Invalid webhook signature")
    }

    const event = JSON.parse(body)
    if (event.event === "payment.captured") {
        const orderId = event.payload.payment.entity.order_id
        const paymentId = event.payload.payment.entity.id

        const payment = await prisma.payment.updateMany({
            where: { razorpayOrderId: orderId, status: "PENDING" },
            data: { status: "SUCCESS", razorpayPaymentId: paymentId }
        })

        // Also flip the related booking to CONFIRMED
        const paymentRecord = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } })
        if (paymentRecord) {
            await prisma.booking.update({
                where: { booking_id: paymentRecord.bookingId },
                data: { status: "CONFIRMED" }
            })
        }
    }

    return res.status(200).json({ received: true })
})

export {
    createOrder,
    verifyPayment,
    getPaymentByBookingId,
    getAllPayments,
    refundPayment,
    razorpayWebhook
}
