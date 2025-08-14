import { Request, Response } from 'express'
import { ethers } from 'ethers'
import { MessageRequest, MessageResponse } from '../types/message'

function normalizeMessage(input: string): string {
  return input.replace(/\r\n/g, '\n').trimEnd()
}

export const verifyMessageSignature = async (req: Request, res: Response) => {
  try {
    const { message, signature }: MessageRequest = req.body

    const normalized = normalizeMessage(message)

    let recoveredAddress: string
    try {
      recoveredAddress = ethers.verifyMessage(normalized, signature)
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature format',
        details: error instanceof Error ? error.message : 'Unknown error'
      } as MessageResponse)
    }

    if (!ethers.isAddress(recoveredAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recovered address'
      } as MessageResponse)
    }
    const checksum = ethers.getAddress(recoveredAddress)

    const response: MessageResponse = {
      success: true,
      data: {
        message: normalized,
        signature,
        recoveredAddress: checksum,
        verified: true,
        timestamp: new Date().toISOString()
      }
    }

    console.log(`Verified message for ${checksum}`)

    return res.status(200).json(response)
  } catch (error) {
    console.error('Error verifying message', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    } as MessageResponse)
  }
}
