import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { isAdmin } from '../middlewares/isAdmin.middleware.js'
import { upload } from '../middlewares/multer.middleware.js'
import { addRoomType, addRoom, deleteRoom, getAllRooms, getAllRoomTypes, getAvailableRooms, getRoomById, updateRoom, updateRoomType } from '../controllers/room.controllers.js'

const router = Router()

router.route('/types').get(getAllRoomTypes)
router.route('/getAllRooms').get(getAllRooms)
router.route('/available').get(getAvailableRooms)
router.route('/:room_id').get(getRoomById)

//Admin only routes 
router.route('/addRoomType').post(verifyJWT, isAdmin, upload.single("image"), addRoomType)
router.route('/addRoom').post(verifyJWT, isAdmin, addRoom)
router.route('/types/:id/updateRoomType').patch(verifyJWT, isAdmin, upload.single("image"), updateRoomType)
router.route('/:room_id/updateRoom').patch(verifyJWT, isAdmin, updateRoom)
router.route('/:room_id').delete(verifyJWT, isAdmin, deleteRoom)

export default router