import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Unhandled error', error)

  const base = {
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  }

  if ((error as any).name === 'ValidationError') {
    return res.status(400).json({
      ...base,
      error: 'Validation error',
      details: error.message
    })
  }

  if ((error as any).name === 'UnauthorizedError') {
    return res.status(401).json({
      ...base,
      error: 'Unauthorized',
      details: error.message
    })
  }

  return res.status(500).json(base)
}
