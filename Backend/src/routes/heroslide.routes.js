import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { createSlide, deleteSlide, getAllSlides, reorderSlides, toggleSlide, updateSlide } from '../controllers/heroslide.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'

const router = Router()

router.route('/').get(getAllSlides)

// Admin only
router.route('/createSlide').post(verifyJWT, isAdmin, upload.single('image'), createSlide)
router.route('/reorder').patch(verifyJWT, isAdmin, reorderSlides)
router.route('/updateSlide/:id').put(verifyJWT, isAdmin, upload.single('image'), updateSlide)
router.route('/toggleSlide/:id').patch(verifyJWT, isAdmin, toggleSlide)
router.route('/deleteSlide/:id').delete(verifyJWT, isAdmin, deleteSlide)

export default router 