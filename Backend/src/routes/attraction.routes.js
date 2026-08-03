import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { createAttraction, deleteAttraction, getAllAttractions, toggleAttraction, updateAttraction } from '../controllers/attraction.controllers.js'

const router = Router()

// Public route
router.route('/').get(getAllAttractions)

// Admin routes
router.route('/createAttraction').post(verifyJWT, isAdmin, upload.single('image'), createAttraction)
router.route('/updateAttraction/:id').put(verifyJWT, isAdmin, upload.single('image'), updateAttraction)
router.route('/toggleAttraction/:id').patch(verifyJWT, isAdmin, upload.single('image'), toggleAttraction)
router.route('/deleteAttraction/:id').delete(verifyJWT, isAdmin, deleteAttraction)

export default router