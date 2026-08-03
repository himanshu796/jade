import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword)
}

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}