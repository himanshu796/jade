import prisma from '../config/prismaClient.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken
} from '../utils/auth.utils.js'

// At least 8 chars, one uppercase, one number, one special character
const PASSWORD_REGEX = /^(?=\S+$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_]).{8,}$/;

// ✅ Reusable validator so both register & changePassword use the same rule
const validatePasswordStrength = (password) => {
    if (!PASSWORD_REGEX.test(password)) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character and no spaces."
        )
    }
}


// ****************************** Register *************************************
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, role, mobile_number, address } = req.body

    if (
        [fullname, email, password].some((field) => !field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // Enforce password strength on the server too
    validatePasswordStrength(password)

    // Check if user already existed 
    const existedUser = await prisma.user.findUnique({
        where: { email }
    })
    if (existedUser) {
        throw new ApiError(409, "User already existed with this email")
    }

    const hashedPassword = await hashPassword(password)

    // Create User 
    const user = await prisma.user.create({
        data: {
            fullname,
            email,
            password: hashedPassword,
            role: "GUEST",
            mobile_number,
            address
        }
    })

    // Remove password & refresh token from response 
    const { password: _, refreshToken: __, ...userWithoutPassword } = user

    return res.status(201).json(
        new ApiResponse(
            201, userWithoutPassword, "User registered successfully"
        )
    )
})

// **************************** Login **********************************
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    // Check if all fields are provided
    if (!email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(password, user.password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid User credentials")
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Save refresh token in db
    await prisma.user.update({
        where: { email },
        data: { refreshToken }
    })

    // Remove password & refresh token from response
    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: userWithoutSensitiveData
            }, "Login Successfully")
        )
})

// ***************************** Logout **************************************
const logoutUser = asyncHandler(async (req, res) => {

    // remove refresh token from db
    await prisma.user.update({
        where: { user_id: req.user.user_id },
        data: { refreshToken: null }
    })

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out")
        )
})

// ************************** Refresh Token when it gets expired ******************
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await prisma.user.findUnique({
            where: { user_id: decodedToken.user_id }
        })

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        const accessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        await prisma.user.update({
            where: { user_id: user.user_id },
            data: { refreshToken: newRefreshToken }
        })

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {}, "Access Token refreshed")
            )
    } catch (error) {
        if (error instanceof ApiError) throw error
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

// *************************** Change Password *************************************
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password & confirm password do not match")
    }

    // Enforce password strength on the new password
    validatePasswordStrength(newPassword)

    const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id }
    })

    const isPasswordCorrect = await comparePassword(oldPassword, user.password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "invalid old password")
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
        where: { user_id: req.user.user_id },
        data: { password: hashedPassword }
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// *************************** Get Profile **************************************
const getProfile = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id },
        select: {
            user_id: true,
            fullname: true,
            email: true,
            role: true,
            mobile_number: true,
            address: true,
            createdAt: true,
            updatedAt: true
        }
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, user, "Profile fetched successfully"))
})

// ************************** Update Profile ***********************************
const updateProfile = asyncHandler(async (req, res) => {
    const { fullname, mobile_number, address, email } = req.body

    if (!fullname && !mobile_number && !address && !email) {
        throw new ApiError(400, "At least one field is required")
    }

    const updateData = {}
    if (fullname) updateData.fullname = fullname
    if (mobile_number) updateData.mobile_number = mobile_number
    if (address) updateData.address = address
    if (email) {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing && existing.user_id !== req.user.user_id) {
            throw new ApiError(409, "Email already in use")
        } updateData.email = email
    }

    const updateUser = await prisma.user.update({
        where: { user_id: req.user.user_id },
        data: updateData,
        select: {
            user_id: true,
            fullname: true,
            email: true,
            role: true,
            mobile_number: true,
            address: true,
            createdAt: true,
            updatedAt: true
        }
    })

    return res.status(200)
        .json(new ApiResponse(200, updateUser, "Profile updated successfully"))
})

// ************************** Delete Profile *******************************
const deleteProfile = asyncHandler(async (req, res) => {
    const { password } = req.body

    if (!password) {
        throw new ApiError(400, "Password is required")
    }

    const user = await prisma.user.findUnique({
        where: { user_id: req.user.user_id }
    })

    const isPasswordCorrect = await comparePassword(password, user.password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid Password")
    }

    await prisma.user.delete({
        where: { user_id: req.user.user_id }
    })

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Account deleted successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getProfile,
    updateProfile,
    deleteProfile,
}
