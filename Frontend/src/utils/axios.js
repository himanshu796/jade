import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true               // sends cookies with every request
})

let isRefreshing = false
let refreshSubscribers = []

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb)
const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb())
    refreshSubscribers = []
}

// Interceptor - handle token expiry automatically
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            if (isRefreshing) {
                // Wait for the in-flight refresh instead of starting a new one
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)))
                })
            }

            isRefreshing = true
            try {
                await axiosInstance.post('users/refresh-token', {}, {})
                isRefreshing = false
                onRefreshed()
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                isRefreshing = false
                refreshSubscribers = []
                // refresh genuinely failed — redirect to login here
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
