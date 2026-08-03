import prisma from "../config/prismaClient.js";

export const cleanupStaleBookings = async () => {
    await prisma.booking.updateMany({
        where: {
            status: "PENDING",
            createdAt: { lt: new Date(Date.now() - 15 * 60 * 1000) }
        },
        data: { status: "CANCELLED" }
    })
}