import 'dotenv/config'

import prisma from '../src/config/prismaClient.js'
import { app } from './app.js'

const port = process.env.PORT || 3000

app.listen(port, async () => {
    console.log(`Server at http://localhost:${port}`)
    // Test DB connection
    await prisma.$connect()
    console.log('Database connected ✅')
})

