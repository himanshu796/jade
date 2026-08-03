import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'


// *********************** Add Room Type (Admin only) ************************************
const addRoomType = asyncHandler(async (req, res) => {
    const { category, price, description, maxGuests, area } = req.body

    // Check if all fields are provided
    if (!category || !price) {
        throw new ApiError(400, "Category & price are required")
    }

    // Check if room already exists
    const existedRoomType = await prisma.roomType.findUnique({
        where: { category }
    })

    if (existedRoomType) {
        throw new ApiError(409, "Room type already exists")
    }

    const imageUrl = (await uploadOnCloudinary(req.file?.path))?.secure_url

    // Create Room
    const roomType = await prisma.roomType.create({
        data: {
            category,
            price: parseFloat(price),
            description: description || null,
            maxGuests: maxGuests ? parseInt(maxGuests) : 1,
            image: imageUrl,
            area: area ? parseInt(area) : null
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, roomType, "Room type added successfully"))
})

// ************************ Add Room ( Admin only ) ****************************
const addRoom = asyncHandler(async (req, res) => {
    const { number, roomTypeId } = req.body

    if (!number || !roomTypeId) {
        throw new ApiError(400, "Number & roomTypeId are required")
    }

    const existedRoom = await prisma.room.findUnique({
        where: { number }
    })

    if (existedRoom) {
        throw new ApiError(409, "Room already exists with this number")
    }

    const roomType = await prisma.roomType.findUnique({
        where: { id: parseInt(roomTypeId) }
    })

    if (!roomType) {
        throw new ApiError(404, "Room type not found")
    }

    const room = await prisma.room.create({
        data: {
            number,
            roomTypeId: parseInt(roomTypeId)
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, room, "Room added successfully"))
})

// *********************** Get all rooms ********************************************
const getAllRooms = asyncHandler(async (req, res) => {
    const { type, isActive, minPrice, maxPrice } = req.query

    // filter dynamically
    const filter = {}
    if (isActive !== undefined) filter.isActive = isActive === "true"

    if (type || minPrice || maxPrice) {
        filter.roomType = {}
        if (type) filter.roomType.category = type
        if (minPrice || maxPrice) {
            filter.roomType.price = {}
            if (minPrice) filter.roomType.price.gte = parseFloat(minPrice)
            if (maxPrice) filter.roomType.price.lte = parseFloat(maxPrice)
        }
    }

    const rooms = await prisma.room.findMany({
        where: filter,
        include: { roomType: true },
        orderBy: { createdAt: "asc" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, rooms, "Rooms fetched successfully"))
})

// ************************* Get all room types ***********************************
const getAllRoomTypes = asyncHandler(async (req, res) => {
    const roomTypes = await prisma.roomType.findMany({
        orderBy: { createdAt: "asc" }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, roomTypes, "Room types fetched successfully"))
})

// ************************ Get room by id *******************************************
const getRoomById = asyncHandler(async (req, res) => {
    const { room_id } = req.params

    const room = await prisma.room.findUnique({
        where: { room_id: parseInt(room_id) },
        include: { roomType: true }
    })

    if (!room) {
        throw new ApiError(404, "Room not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, room, "Room fetched successfully"))
})

// ************************* Update Room Type (Admin only) ***************************
const updateRoomType = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { category, price, description, maxGuests, area } = req.body

    const roomType = await prisma.roomType.findUnique({
        where: { id: parseInt(id) }
    })

    if (!roomType) {
        throw new ApiError(404, "Room type not found")
    }

    const imageUrl = req.file?.path ? (await uploadOnCloudinary(req.file.path))?.secure_url : roomType.image

    const updateData = {}

    if (category) updateData.category = category
    if (price) updateData.price = parseFloat(price)
    if (description) updateData.description = description
    if (maxGuests) updateData.maxGuests = parseInt(maxGuests)
    if (imageUrl) updateData.image = imageUrl
    if (area) updateData.area = parseInt(area)

    const updatedRoomType = await prisma.roomType.update({
        where: { id: parseInt(id) },
        data: updateData
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updatedRoomType, "Room Type updated successfully"))
})

// ************************ Update Room (Admin only) **********************************
const updateRoom = asyncHandler(async (req, res) => {
    const { room_id } = req.params
    const { number, isActive, roomTypeId } = req.body

    const room = await prisma.room.findUnique({
        where: { room_id: parseInt(room_id) }
    })

    if (!room) {
        throw new ApiError(404, "Room not found")
    }

    const updateData = {}
    if (number) updateData.number = number
    if (isActive !== undefined) updateData.isActive = isActive === "true"
    if (roomTypeId) updateData.roomTypeId = parseInt(roomTypeId)

    const updatedRoom = await prisma.room.update({
        where: { room_id: parseInt(room_id) },
        data: updateData,
        include: { roomType: true }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updatedRoom, "Room updated successfully"))
})

// *************************** Delete Room (Admin only) *******************************
const deleteRoom = asyncHandler(async (req, res) => {
    const { room_id } = req.params

    const room = await prisma.room.findUnique({
        where: { room_id: parseInt(room_id) }
    })

    if (!room) {
        throw new ApiError(404, "Room not found")
    }

    await prisma.room.delete({
        where: { room_id: parseInt(room_id) }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Room deleted successfully"))
})

// ************************* Get available rooms for specific dates ********************
const getAvailableRooms = asyncHandler(async (req, res) => {
    const { checkIn, checkOut, type, minPrice, maxPrice } = req.query

    if (!checkIn || !checkOut) {
        throw new ApiError(400, "Check-in & check-out dates are required")
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
        throw new ApiError(400, "Invalid check-in & check-out dates")
    }

    const roomTypeFilter = {}
    if (type) roomTypeFilter.category = type
    if (minPrice || maxPrice) {
        roomTypeFilter.price = {}
        if (minPrice) roomTypeFilter.price.gte = parseFloat(minPrice)
        if (maxPrice) roomTypeFilter.price.lte = parseFloat(maxPrice)
    }

    const roomTypes = await prisma.roomType.findMany({
        where: roomTypeFilter,
        include: {
            rooms: {
                where: {
                    isActive: true,
                    bookings: {
                        none: {
                            AND: [
                                { checkIn: { lt: checkOutDate } },
                                { checkOut: { gt: checkInDate } },
                                { status: { not: "CANCELLED" } }
                            ]
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: "asc" }
    })

    const availableRoomTypes = roomTypes
        .filter((rt) => rt.rooms.length > 0)
        .map(({ rooms, ...rt }) => ({
            ...rt,
            availableCount: rooms.length
        }))

    return res
        .status(200)
        .json(new ApiResponse(200, availableRoomTypes, "Available rooms fetched successsfully"))
})

export {
    addRoomType,
    addRoom,
    getAllRooms,
    getAllRoomTypes,
    getRoomById,
    updateRoomType,
    updateRoom,
    deleteRoom,
    getAvailableRooms
}