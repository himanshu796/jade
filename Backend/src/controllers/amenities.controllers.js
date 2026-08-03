import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// ************************** Get all active amenities *******************
const getAllAmenities = asyncHandler(async (req, res) => {
    const amenities = await prisma.amenity.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, amenities, "Amenities fetched successfully"))
})

export { getAllAmenities }