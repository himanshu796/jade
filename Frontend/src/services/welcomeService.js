import { axiosInstance } from "../utils/axios.js";

// Fetch Welcome section copy (heading, subheading, paragraphs)
const getWelcomeData = async () => {
    const response = await axiosInstance.get('/welcome')
    return response.data.data
}

export {
    getWelcomeData
}