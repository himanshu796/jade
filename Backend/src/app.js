import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))


// Webhook route needs RAW body — must come BEFORE express.json()
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }))

app.use(express.json({ limit: "32kb" }))
app.use(express.urlencoded({ extended: true, limit: "32kb" }))

app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.json({ message: "Hotel Management API running 🏨" })
})

// routes import
import userRouter from './routes/user.routes.js'
import roomRouter from './routes/room.routes.js'
import bookingRouter from './routes/booking.routes.js'
import paymentRouter from './routes/payment.routes.js'
import slideRouter from './routes/heroslide.routes.js'
import diningGalleryRouter from './routes/diningGallery.routes.js'
import attractionRouter from './routes/attraction.routes.js'
import amenitiesRouter from './routes/amenities.routes.js'
import reviewRouter from './routes/review.routes.js'
import aboutRouter from './routes/about.routes.js'
import welcomeRouter from './routes/welcome.routes.js'

// routes declaration
app.use('/api/v1/users', userRouter)
app.use('api/v1/welcome', welcomeRouter)
app.use('/api/v1/rooms', roomRouter)
app.use('/api/v1/bookings', bookingRouter)
app.use('/api/v1/payments', paymentRouter)
app.use('/api/v1/heroslides', slideRouter)
app.use('/api/v1/dininggallery', diningGalleryRouter)
app.use('/api/v1/attraction', attractionRouter)
app.use('/api/v1/amenities', amenitiesRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/about', aboutRouter)

app.use((err, req, res, next) => {
    console.log("Full error object:", JSON.stringify({
        message: err.message,
        statusCode: err.statusCode,
        errors: err.errors,
        name: err.name
    }))

    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || "Something went wrong",
        errors: err.errors || [],
        data: err.data || null
    })
})

export { app }