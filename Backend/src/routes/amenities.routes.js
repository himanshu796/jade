import { Router } from 'express'
import { getAllAmenities } from "../controllers/amenities.controllers.js";

const router = Router()

router.route('/').get(getAllAmenities)

export default router