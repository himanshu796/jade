import prisma from '../config/prismaClient.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { deleteFromCloudinary } from '../utils/cloudinaryHelper.js'


// ****************************** Get all active slides **********************
const getAllSlides = asyncHandler(async (req, res) => {
    const slides = await prisma.heroSlide.findMany({
        orderBy: { order: 'asc' }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, slides, "Slides fetched successfully"))
})

// ******************************* Create new slide ***************************
const createSlide = asyncHandler(async (req, res) => {
    const localFilePath = req.file?.path

    if (!localFilePath) {
        throw new ApiError(400, "Image is required")
    }

    const cloudinaryResponse = await uploadOnCloudinary(localFilePath)

    if (!cloudinaryResponse) {
        throw new ApiError(400, "Cloudinary upload failed")
    }

    const slide = await prisma.heroSlide.create({
        data: {
            imageUrl: cloudinaryResponse.url,
            order: Number(req.body.order) || 1,
            isActive: req.body.isActive === 'false' ? false : true
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, slide, "Slide created successfully"))

})

// **************************** Update slide / replace image *********************
const updateSlide = asyncHandler(async (req, res) => {
    const { id } = req.params

    const existingSlide = await prisma.heroSlide.findUnique({
        where: { id: Number(id) }
    })

    if (!existingSlide) {
        throw new ApiError(404, "Slide not found")
    }

    let imageUrl = existingSlide.imageUrl

    if (req.file?.path) {
        await deleteFromCloudinary(existingSlide.imageUrl)

        const cloudinaryResponse = await uploadOnCloudinary(req.file?.path)

        if (!cloudinaryResponse) {
            throw new ApiError(500, "Cloudinary upload failed")
        }
        imageUrl = cloudinaryResponse.url
    }

    const updated = await prisma.heroSlide.update({
        where: { id: Number(id) },
        data: {
            imageUrl,
            order: req.body.order ? Number(req.body.order) : existingSlide.order,
            isActive: req.body.isActive !== undefined
                ? req.body.isActive === 'true'
                : existingSlide.isActive
        }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Slide updated successfully"))

})

// ***************************** Toggle isActive *****************************
const toggleSlide = asyncHandler(async (req, res) => {
    const slide = await prisma.heroSlide.findUnique({
        where: { id: Number(req.params.id) }
    })

    if (!slide) {
        throw new ApiError(404, "Slide not found")
    }

    const updated = await prisma.heroSlide.update({
        where: { id: Number(req.params.id) },
        data: { isActive: !slide.isActive }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Slide toggled successfully"))
})

// ***************************** Reorder slides *******************************
const reorderSlides = asyncHandler(async (req, res) => {
    const { slides } = req.body

    if (!slides || !Array.isArray(slides)) {
        throw new ApiError(400, "Slides array is required")
    }

    // ✅ Step 1: Set temp negative orders to avoid any potential conflicts
    const tempUpdates = slides.map(({ id }, index) =>
        prisma.heroSlide.update({
            where: { id },
            data: { order: -(index + 1) }
        })
    )
    await prisma.$transaction(tempUpdates)

    // ✅ Step 2: Set actual final orders
    const finalUpdates = slides.map(({ id, order }) =>
        prisma.heroSlide.update({
            where: { id },
            data: { order }
        })
    )
    await prisma.$transaction(finalUpdates)

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Slides reordered successfully"))
})

// **************************** Remove slide *************************************
const deleteSlide = asyncHandler(async (req, res) => {
    const slide = await prisma.heroSlide.findUnique({
        where: { id: Number(req.params.id) }
    })

    if (!slide) {
        throw new ApiError(404, "Slide not found")
    }

    await deleteFromCloudinary(slide.imageUrl)

    await prisma.heroSlide.delete({
        where: { id: Number(req.params.id) }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Slide deleted successfully"))
})

export {
    getAllSlides,
    createSlide,
    updateSlide,
    toggleSlide,
    reorderSlides,
    deleteSlide
}