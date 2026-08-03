import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import prisma from '../config/prismaClient.js'


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await prisma.user.findUnique({
            where: { user_id: decodedToken.user_id }
        })

        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user

        req.user = userWithoutSensitiveData
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})