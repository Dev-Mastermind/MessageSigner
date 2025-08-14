import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { messageRoutes } from './routes/messageRoutes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.set('trust proxy', 1)

app.use(helmet())

const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    const list = allowed.length ? allowed : defaultOrigins
    if (list.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/messages', messageRoutes)

app.use('*', (_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})
