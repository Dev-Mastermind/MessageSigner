import { useState } from 'react'
import axios from 'axios'

function normalizeBaseUrl(raw?: string) {
  const url = (raw || '').trim().replace(/\/+$/, '')
  return url
}

const FALLBACK =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : 'http://localhost:3001'

const API_BASE = normalizeBaseUrl(import.meta.env.VITE_API_URL) || FALLBACK

export type VerificationSuccess = {
  success: true
  data: {
    message: string
    signature: string
    recoveredAddress: string
    verified: boolean
    timestamp: string
    address?: string
  }
}

export type VerificationFailure = {
  success: false
  error: string
  details?: string
}

export type VerificationResult = VerificationSuccess | VerificationFailure

export const useMessageService = () => {
  const [isVerifying, setIsVerifying] = useState(false)

  const verifySignature = async (
    message: string,
    signature: string
  ): Promise<VerificationResult> => {
    setIsVerifying(true)
    try {
      const res = await axios.post<VerificationResult>(
        `${API_BASE}/api/messages/verify`,
        { message, signature },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      )
      return res.data
    } catch (error: any) {
      if (error.response) {
        return {
          success: false,
          error: `Server error, ${error.response.status}`,
          details:
            typeof error.response.data === 'string'
              ? error.response.data
              : error.response.data?.error || error.message || 'Unknown server error',
        }
      }
      if (error.request) {
        const corsHint = error.message?.includes('Network Error')
          ? 'Possible CORS or server is offline'
          : 'Network error'
        return {
          success: false,
          error: 'Network error',
          details: `${corsHint}, could not reach ${API_BASE}`,
        }
      }
      return {
        success: false,
        error: 'Verification error',
        details: error?.message || 'Unknown error',
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return { verifySignature, isVerifying }
}
