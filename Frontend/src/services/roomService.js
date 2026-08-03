import { axiosInstance } from '../utils/axios.js'

// Fetch all rooms
const getRooms = async () => {
    const response = await axiosInstance.get('/rooms/getAllRooms')
    return response.data.data
}

// NEW: Fetch all room types (catalog — for browse/showcase pages)
const getRoomTypes = async () => {
    const response = await axiosInstance.get('/rooms/types')
    return response.data.data
}

// Check available rooms by date
const getAvailableRooms = async (checkIn, checkOut) => {
    const response = await axiosInstance.get(`/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`)
    return response.data.data
}

export {
    getRooms,
    getRoomTypes,
    getAvailableRooms
}