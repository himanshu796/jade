import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { createReview, deleteReview, getAllReviews, toggleReview } from '../controllers/review.controllers.js'

const router = Router()

// Public routes
router.route('/').get(getAllReviews)
router.route('/createReview').post(createReview)

// Admin routes
router.route('/toggleReview/:id').patch(verifyJWT, isAdmin, toggleReview)
router.route('/deleteReview/:id').delete(verifyJWT, isAdmin, deleteReview)

export default router