import { axiosInstance } from "../utils/axios.js";

// fetch all active heroslides images (for HeroSlideSection)
const getHeroSlides = async () => {
    const response = await axiosInstance.get('/heroslides')
    return response.data.data.filter((slide) => slide.isActive)
}

// fetch all room images(full room list, includes image field)
const getRoomImages = async () => {
    const response = await axiosInstance.get('/rooms/types')
    return response.data.data
}

// fetch a single room's image by room_id
const getRoomImageById = async (room_id) => {
    const response = await axiosInstance.get(`/rooms/${room_id}`)
    return response.data.data
}

// Fetch only specific image (for section Welcome)
const getWelcomeImage = async () => {
    const response = await axiosInstance.get('/heroslides')
    const activeSlides = response.data.data.filter((slide) => slide.id === 6)
    return activeSlides.length > 0 ? activeSlides[0].imageUrl : null
}

// Fetch only specific image (for Room page)
const getBgRoomImage = async () => {
    const response = await axiosInstance.get('/heroslides')
    const activeSlides = response.data.data.filter((slide) => slide.id === 2)
    return activeSlides.length > 0 ? activeSlides[0].imageUrl : null
}

// Fetch only specific image (for Review page)
const getBgReviewImage = async () => {
    const response = await axiosInstance.get('/heroslides')
    const activeSlides = response.data.data.filter((slide) => slide.id === 5)
    return activeSlides.length > 0 ? activeSlides[0].imageUrl : null
}

// Fetch only specific image (for Login/Register page)
const getBgLoginImage = async () => {
    const response = await axiosInstance.get('/heroslides')
    const activeSlides = response.data.data.filter((slide) => slide.id === 1)
    return activeSlides.length > 0 ? activeSlides[0].imageUrl : null
}

// Fetch only specific image (for About us page)
const getBgAboutImage = async () => {
    const response = await axiosInstance.get('/heroslides')
    const activeSlides = response.data.data.filter((slide) => slide.id === 3)
    return activeSlides.length > 0 ? activeSlides[0].imageUrl : null
}

// Fetch top N featured room images (default 5)
const getFeaturedRoomImages = async (limit = 5) => {
    const response = await axiosInstance.get('/rooms/types')
    return response.data.data.slice(0, limit)
}

// Fetch dining items by category
const getDiningImages = async (category = null) => {
    const url = category ? `/dininggallery?category=${category}` : '/dininggallery'
    const response = await axiosInstance.get(url)
    return response.data.data
}

// Fetch all active images for attraction
const getAttractions = async () => {
    const response = await axiosInstance.get('/attraction')
    return response.data.data
}

// Fetch all images from heroslides,rooms & dining
const getAllGalleryImages = async () => {
    const [heroRes, roomsRes, diningRes] = await Promise.all([
        axiosInstance.get('/heroslides'),
        axiosInstance.get('/rooms/types'),
        axiosInstance.get('/dininggallery')
    ])

    const heroImages = heroRes.data.data
        .filter((s) => s.isActive)
        .map((s) => ({ url: s.imageUrl, category: 'Outdoor' }))

    const roomImages = roomsRes.data.data
        .filter((r) => r.image)
        .map((r) => ({ url: r.image, category: 'Rooms' }))

    const diningImages = diningRes.data.data
        .filter((d) => d.isActive)
        .map((d) => ({ url: d.imageUrl, category: 'Dining' }))

    return [...heroImages, ...roomImages, ...diningImages]
}

// Fetch about image
const getAbout = async () => {
    const response = await axiosInstance.get('/about')
    return response.data.data
}

export {
    getHeroSlides,
    getRoomImages,
    getRoomImageById,
    getWelcomeImage,
    getBgRoomImage,
    getBgReviewImage,
    getBgLoginImage,
    getBgAboutImage,
    getFeaturedRoomImages,
    getDiningImages,
    getAttractions,
    getAllGalleryImages,
    getAbout
}