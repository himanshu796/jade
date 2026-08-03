import { Router } from "express"
import getAbout from "../controllers/about.controllers.js"

const router = Router()

router.route('/').get(getAbout)

export default router