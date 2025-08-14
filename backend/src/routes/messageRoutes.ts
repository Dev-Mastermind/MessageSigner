import { Router } from 'express'
import { verifyMessageSignature } from '../controllers/messageController'
import { validateMessageRequest } from '../middleware/validation'

const router = Router()

router.post('/verify', validateMessageRequest, verifyMessageSignature)

export { router as messageRoutes }
