import { Router } from "express";
import { getWelcome } from "../controllers/welcomeController.js";

const router = Router();

router.get("/", getWelcome);

export default router;