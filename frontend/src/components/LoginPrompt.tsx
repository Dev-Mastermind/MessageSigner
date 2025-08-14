import React, { useState } from 'react'
import {
  useDynamicContext,
  useConnectWithOtp,
  useEmbeddedWallet,
  useUserWallets,
} from '@dynamic-labs/sdk-react-core'
import { Wallet, Shield, Lock } from 'lucide-react'

type Step = 'email' | 'code' | 'done'

const normalizeEmail = (raw: string) =>
  raw.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().toLowerCase()

export const LoginPrompt: React.FC = () => {
  const { user } = useDynamicContext()
  const otp = useConnectWithOtp() as any
  const { createEmbeddedWallet } = useEmbeddedWallet()
  const userWallets = useUserWallets()

  const {
    connectWithEmail,
    verifyOneTimePassword,
    isLoading,
    error,
  } = otp || {}

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<Step>(user ? 'done' : 'email')
  const [localError, setLocalError] = useState<string | null>(null)

  const startEmailOtp = async () => {
    setLocalError(null)
    try {
      const cleanEmail = normalizeEmail(email)
      if (!cleanEmail) throw new Error('Please enter your email')

      const looksOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
      if (!looksOk) throw new Error('Email format looks wrong')

      if (typeof connectWithEmail !== 'function') {
        console.warn('OTP hook keys', Object.keys(otp || {}))
        throw new Error('Email connector unavailable, check provider authModes and package versions')
      }

      await connectWithEmail(cleanEmail)
      setStep('code')
    } catch (e: any) {
      console.error('connectWithEmail error', e)
      setLocalError(e?.message || 'Failed to start email login')
    }
  }

  const verifyEmailOtp = async () => {
    setLocalError(null)
    try {
      if (!code) throw new Error('Please enter the code')

      if (typeof verifyOneTimePassword !== 'function') {
        throw new Error('OTP verifier unavailable')
      }

      await verifyOneTimePassword(code)

      const hasEmbedded = Array.isArray(userWallets)
      ? userWallets.some(w => 'embeddedWallet' in w && w.embeddedWallet === true)
      : false
    

      if (!hasEmbedded) {
        await createEmbeddedWallet()
      }

      setStep('done')
    } catch (e: any) {
      console.error('verifyOneTimePassword error', e)
      setLocalError(e?.message || 'Invalid code, please try again')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Web3 Message Signer
          </h2>
          <p className="text-gray-600">
            Sign and verify messages with your embedded Web3 wallet
          </p>
        </div>

        {step === 'email' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Wallet className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900">Email sign in</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Enter your email, we will send you a one time code
                  </p>
                </div>
              </div>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              placeholder="you@example.com"
              className="input-field w-full"
              autoComplete="email"
            />

            {!!localError && <p className="text-sm text-red-600">{localError}</p>}
            {!!error && <p className="text-sm text-red-600">{String(error)}</p>}

            <button
              onClick={startEmailOtp}
              disabled={!email || isLoading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        )}

        {step === 'code' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-900">Enter verification code</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Check your email for the 6 digit code
                  </p>
                </div>
              </div>
            </div>

            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="input-field w-full tracking-widest text-center"
            />

            {!!localError && <p className="text-sm text-red-600">{localError}</p>}

            <div className="flex gap-3">
              <button
                onClick={verifyEmailOtp}
                disabled={!code || isLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify and Continue'}
              </button>
              <button onClick={() => setStep('email')} className="btn-secondary">
                Change Email
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4">
            <p className="text-gray-700">
              You are signed in, your embedded wallet is ready
            </p>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-6">
          By connecting, you agree to our terms of service and privacy policy
        </p>
      </div>
    </div>
  )
}

export default LoginPrompt
