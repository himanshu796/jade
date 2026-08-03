import prisma from "../config/prismaClient.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


// ******************* Get About **********************
const getAbout = asyncHandler(async (req, res) => {
    const about = await prisma.about.findFirst()

    if (!about) {
        throw new ApiError(404, "About not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            ...about,
            storyParagraphs: about.storyParagraphs.split('\n\n'),
            visionParagraphs: about.visionParagraphs.split('\n\n')
        }, "About fetched successfully"))
})

export default getAbout