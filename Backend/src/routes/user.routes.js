import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, changePassword, updateProfile, deleteProfile, getProfile } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/profile").get(verifyJWT, getProfile)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/update-profile").patch(verifyJWT, updateProfile)
router.route("/delete-profile").delete(verifyJWT, deleteProfile)

export default router