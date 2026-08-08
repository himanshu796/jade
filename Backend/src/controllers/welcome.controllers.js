import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getWelcome = asyncHandler(async (req, res) => {
    const welcome = await prisma.welcome.findUnique({
        where: { id: 1 }
    });

    if (!welcome) throw new ApiError(404, "Welcome content not found");
    return res.status(200)
        .json(new ApiResponse(200, welcome, "Welcome content fetched"));
});

export { getWelcome };