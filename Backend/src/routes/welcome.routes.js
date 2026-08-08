import { Router } from "express";
import { getWelcome } from "../controllers/welcome.controllers.js";

const router = Router();

router.get("/", getWelcome);

export default router;