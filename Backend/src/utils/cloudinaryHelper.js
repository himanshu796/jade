import { v2 as cloudinary } from 'cloudinary'

// Extract public id from Cloudinary url
export const extractPublicId = (url) => {
    const parts = url.split('/')
    const filename = parts[parts.length - 1].split('.')[0]
    const folder = parts[parts.length - 2]
    return `${folder}/${filename}`
}

// Delete image from Cloudinary
export const deleteFromCloudinary = async (url) => {
    const publicId = extractPublicId(url)
    await cloudinary.uploader.destroy(publicId)
}