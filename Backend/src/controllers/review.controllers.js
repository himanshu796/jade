import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

// ***************************** Get all Reviews **************************
const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await prisma.review.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully"))
})

// ************************** Create Review ***************************
const createReview = asyncHandler(async (req, res) => {
    const { name, email, rating, comment } = req.body

    if (!name || !rating || !comment || !email) {
        throw new ApiError(400, "Name, rating, email & comment  are required")
    }

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 & 5")
    }

    const review = await prisma.review.create({
        data: {
            name,
            email,
            rating: parseInt(rating),
            comment,
            isActive: true
        }
    })

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review created succesfully"))
})

// ***************************** Toggle Review (Admin only) **********************
const toggleReview = asyncHandler(async (req, res) => {
    const review = await prisma.review.findUnique({
        where: { id: parseInt(req.params.id) }
    })
    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    const updated = await prisma.review.update({
        where: { id: parseInt(req.params.id) },
        data: { isActive: !review.isActive }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, updated, "Review toggled successfully"))
})

// ******************************* Delete Review (Admin only) **********************
const deleteReview = asyncHandler(async (req, res) => {
    const review = await prisma.review.findUnique({
        where: { id: parseInt(req.params.id) }
    })

    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    await prisma.review.delete({
        where: { id: parseInt(req.params.id) }
    })

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Review deleted succesfully"))
})

export {
    getAllReviews,
    createReview,
    toggleReview,
    deleteReview
}