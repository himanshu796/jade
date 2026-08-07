import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { cleanupStaleBookings } from '../utils/cleanupStaleBookings.js'

// GST calculation
const getGstRate = (pricePerNight) => {
    if (pricePerNight <= 1000) return 0
    if (pricePerNight <= 7500) return 0.05
    return 0.18
}

// ************************* Create Booking **************************
const createBooking = asyncHandler(async (req, res) => {
    await cleanupStaleBookings()
    const { roomTypeId, checkIn, checkOut } = req.body

    if (!roomTypeId || !checkIn || !checkOut) {
        throw new ApiError(400, "All fields are required")
    }

    // convert to date objects
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    // check if checkIn is before checkOut
    if (checkInDate >= checkOutDate) {
        throw new ApiError(400, "Check-in date must be before check-out date")
    }

    // check if checkIn is in the future
    if (checkInDate < new Date()) {
        throw new ApiError(400, "Check-in date must be in the future")
    }

    // check if room type exists
    const roomType = await prisma.roomType.findUnique({
        where: { id: parseInt(roomTypeId) }
    })

    if (!roomType) {
        throw new ApiError(400, "Room type not found")
    }

    const availableRoom = await prisma.room.findFirst({
        where: {
            roomTypeId: parseInt(roomTypeId),
            isActive: true,
            bookings: {
                none: {
                    AND: [
                        { checkIn: { lt: checkOutDate } },
                        { checkOut: { gt: checkInDate } },
                        {
                            OR: [
                                { status: "CONFIRMED" },
                                {
                                    status: "PENDING",
                                    createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) }
                                }
                            ]
                        }
                    ]
                }
            }
        }
    })

    if (!availableRoom) {
        throw new ApiError(409, "No rooms of this type available for the selected dates")
    }

    // calculate total price
    const days = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    )

    // Subtotal is now the pre-tax figure
    // GST is calculated and added on top
    // Total Amount
    const subtotal = days * roomType.price
    const gstRate = getGstRate(roomType.price)
    const taxAmount = Math.round(subtotal * gstRate)
    const totalPrice = subtotal + taxAmount


    // create booking
    const booking = await prisma.booking.create({
        data: {
            userId: req.user.user_id,
            roomId: availableRoom.room_id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice,
            status: "PENDING"
        },
        include: {
            room: { include: { roomType: true } },
            user: {
                select: {
                    user_id: true,
                    fullname: true,
                    email: true
                }
            }
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Booking created successfully"))
})


// ************************ Get all bookings (Admin only) ********************************
const getAllBookings = asyncHandler(async (req, res) => {
    await cleanupStaleBookings()
    const { status } = req.query

    const filter = {}
    if (status) filter.status = status

    const bookings = await prisma.booking.findMany({
        where: filter,
        include: {
            room: { include: { roomType: true } },
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
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"))
})


// *********************** Get my bookings (logged in user) ***************************
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
        where: { userId: req.user.user_id },
        include: {
            room: { include: { roomType: true } }
        },
        orderBy: { createdAt: "desc" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"))
})


// ********************** Get Booking by Id **************************************
const getBookingById = asyncHandler(async (req, res) => {
    const { booking_id } = req.params

    const booking = await prisma.booking.findUnique({
        where: { booking_id: parseInt(booking_id) },
        include: {
            room: { include: { roomType: true } },
            user: {
                select: {
                    user_id: true,
                    fullname: true,
                    email: true
                }
            }
        }
    })

    if (!booking) {
        throw new ApiError(400, "Booking not found")
    }

    // Check if booking belonged to logged in user or admin
    if (booking.userId !== req.user.user_id && req.user.role !== "ADMIN") {
        throw new ApiError(400, "Access denied")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "Booking fetched successfully"))
})


// ************************ Update booking status (Admin only) *****************************
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { booking_id } = req.params
    const { status } = req.body

    if (!status) {
        throw new ApiError(400, "Status is required")
    }

    const booking = await prisma.booking.findUnique({
        where: { booking_id: parseInt(booking_id) }
    })

    if (!booking) {
        throw new ApiError(400, "Booking not found")
    }

    const updateBooking = await prisma.booking.update({
        where: { booking_id: parseInt(booking_id) },
        data: { status },
        include: { room: { include: { roomType: true } } }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updateBooking, "Booking status updated successfully"))
})


// *********************** Cancel Booking (logged in user) ************************
const cancelBooking = asyncHandler(async (req, res) => {
    const { booking_id } = req.params

    const booking = await prisma.booking.findUnique({
        where: { booking_id: parseInt(booking_id) }
    })

    if (!booking) {
        throw new ApiError(400, "Booking not found")
    }

    // Check if booking belongs to logged in user
    if (booking.userId !== req.user.user_id) {
        throw new ApiError(403, "Access denied")
    }

    // Check if booking is already cancelled
    if (booking.status === "CANCELLED") {
        throw new ApiError(400, "Booking already cancelled")
    }

    // Check if booking is already completed
    if (booking.status === "COMPLETED") {
        throw new ApiError(400, "Completed booking cannot be cancelled")
    }

    // Cancel booking
    const cancelledBooking = await prisma.booking.update({
        where: { booking_id: parseInt(booking_id) },
        data: { status: "CANCELLED" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, cancelledBooking, "Booking cancelled successfully"))
})


export {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getMyBookings
}