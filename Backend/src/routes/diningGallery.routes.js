import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { createDiningItem, deleteDiningItem, getAllDiningItems, toggleDiningItem, updateDiningItem } from '../controllers/diningGallery.controllers.js'


const router = Router()

// public routes
router.route('/').get(getAllDiningItems)

// Admin only routes
router.route('/createDining').post(verifyJWT, isAdmin, upload.single('image'), createDiningItem)
router.route('/updateDining/:id').put(verifyJWT, isAdmin, upload.single('image'), updateDiningItem)
router.route('/toggle/:id').patch(verifyJWT, isAdmin, toggleDiningItem)
router.route('/delete/:id').delete(verifyJWT, isAdmin, deleteDiningItem)

export default router