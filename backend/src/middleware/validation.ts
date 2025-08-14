import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

const messageVerificationSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message too long'),
  signature: z
    .string()
    .regex(/^0x[0-9a-fA-F]{130}$/, 'Invalid signature format')
})

export const validateMessageRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = messageVerificationSchema.parse(req.body)
    req.body = validated
    return next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))
      })
    }
    return res.status(500).json({
      success: false,
      error: 'Validation error',
      details: 'Unknown validation error occurred'
    })
  }
}
