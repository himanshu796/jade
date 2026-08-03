import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js'

// ***************************** Get all active Attractions ********************
const getAllAttractions = asyncHandler(async (req, res) => {
    const attractions = await prisma.attraction.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, attractions, "Attractions fetched successfully"))
})

// ***************************** Create Attraction (Admin only) ********************
const createAttraction = asyncHandler(async (req, res) => {
    const { title, description, distance } = req.body
    const localFilePath = req.file?.path

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    if (!localFilePath) {
        throw new ApiError(400, "Image is required")
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
    if (!cloudinaryResponse) {
        throw new ApiError(500, "Image upload failed")
    }

    const attraction = await prisma.attraction.create({
        data: {
            title,
            description,
            imageUrl: cloudinaryResponse.url,
            distance: distance || null,
            isActive: true
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, attraction, "Attraction created successfully"))
})

// ************************** Update Attraction (Admin only) ***********************
const updateAttraction = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, distance, isActive } = req.body

    const existingAttraction = await prisma.attraction.findUnique({
        where: { id: parseInt(id) }
    })
    if (!existingAttraction) {
        throw new ApiError(404, "Attraction not found")
    }

    let imageUrl = existingAttraction.imageUrl
    if (req.file?.path) {
        await deleteFromCloudinary(existingAttraction.imageUrl)

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path)
        if (!cloudinaryResponse) {
            throw new ApiError(500, "Image upload failed")
        }
        imageUrl = cloudinaryResponse.url
    }

    const updateAttraction = await prisma.attraction.update({
        where: { id: parseInt(id) },
        data: {
            title: title || existingAttraction.title,
            description: description || existingAttraction.description,
            imageUrl,
            distance: distance || existingAttraction.distance,
            isActive: isActive !== undefined
                ? isActive === 'true'
                : existingAttraction.isActive
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updateAttraction, "Attraction updated successfully"))
})

// *********************** Toggle isActive (Admin only) **************************
const toggleAttraction = asyncHandler(async (req, res) => {
    const attraction = await prisma.attraction.findUnique({
        where: { id: parseInt(req.params.id) }
    })
    if (!attraction) {
        throw new ApiError(404, "Attraction not found")
    }

    const updated = await prisma.attraction.update({
        where: { id: parseInt(req.params.id) },
        data: { isActive: !attraction.isActive }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Attraction updated successfully"))
})

// **************************** Delete Attraction (Admin only) ***********************
const deleteAttraction = asyncHandler(async (req, res) => {
    const attraction = await prisma.attraction.findUnique({
        where: { id: parseInt(req.params.id) }
    })
    if (!attraction) {
        throw new ApiError(404, "Attraction not found")
    }

    await deleteFromCloudinary(attraction.imageUrl)

    await prisma.attraction.delete({
        where: { id: parseInt(req.params.id) }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Attraction deleted successfully"))
})


export {
    getAllAttractions,
    createAttraction,
    updateAttraction,
    toggleAttraction,
    deleteAttraction
}


