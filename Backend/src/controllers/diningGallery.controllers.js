import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js'


// *************************** Get all active items **************************
const getAllDiningItems = asyncHandler(async (req, res) => {
    const { category } = req.query

    const filter = { isActive: true }
    if (category) filter.category = category

    const items = await prisma.diningGallery.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, items, "Dining items fetched successfully"))
})

// *************************** Create dining item (Admin only) ****************
const createDiningItem = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    const localFilePath = req.file?.path

    if (!title || !category) {
        throw new ApiError(400, "Title & category are required")
    }

    if (!localFilePath) {
        throw new ApiError(400, "Image is required")
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
    if (!cloudinaryResponse) {
        throw new ApiError(500, "Image upload failed")
    }

    const item = await prisma.diningGallery.create({
        data: {
            title,
            description: description || null,
            imageUrl: cloudinaryResponse.url,
            category: category || "DINING",
            isActive: true
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, item, "Dining item created successfully"))
})

// ************************ Update dining item (Admin only) **********************
const updateDiningItem = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { title, description, category, isActive } = req.body

    const existingItem = await prisma.diningGallery.findUnique({
        where: { id: parseInt(id) }
    })
    if (!existingItem) {
        throw new ApiError(404, "Dining item not found")
    }

    let imageUrl = existingItem.imageUrl
    if (req.file?.path) {
        await deleteFromCloudinary(existingItem.imageUrl)

        const cloudinaryResponse = await uploadOnCloudinary(req.file.path)

        if (!cloudinaryResponse) {
            throw new ApiError(500, "Image upload failed")
        }
        imageUrl = cloudinaryResponse.url
    }

    const updatedItem = await prisma.diningGallery.update({
        where: { id: parseInt(id) },
        data: {
            title: title || existingItem.title,
            description: description || existingItem.description,
            imageUrl,
            category: category || existingItem.category,
            isActive: isActive !== undefined
                ? isActive === "true"
                : existingItem.isActive
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updatedItem, "Dining item updated successfully"))
})

// ************************* Toggle isActive (Admin only) ************************
const toggleDiningItem = asyncHandler(async (req, res) => {
    const item = await prisma.diningGallery.findUnique({
        where: { id: parseInt(req.params.id) }
    })
    if (!item) {
        throw new ApiError(404, "Dining item not found")
    }

    const updated = await prisma.diningGallery.update({
        where: { id: parseInt(req.params.id) },
        data: { isActive: !item.isActive }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Dining item toggled successfully"))
})

// **************************** Delete Dining Item (Admin only) *******************
const deleteDiningItem = asyncHandler(async (req, res) => {
    const item = await prisma.diningGallery.findUnique({
        where: { id: parseInt(req.params.id) }
    })
    if (!item) {
        throw new ApiError(404, "Dining item not found")
    }

    await deleteFromCloudinary(item.imageUrl)

    await prisma.diningGallery.delete({
        where: { id: parseInt(req.params.id) }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Dining Item deleted successfully"))
})

export {
    getAllDiningItems,
    createDiningItem,
    updateDiningItem,
    toggleDiningItem,
    deleteDiningItem
}