import React, { useState } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useMessageService } from '../hooks/useMessageService'
import { MessageInput } from './MessageInput'
import { SignatureResult } from './SignatureResult'
import { AlertTriangle } from 'lucide-react'
import { useMessageHistory } from '../hooks/useMessageHistory'

async function signWithWallet(primaryWallet: any, message: string): Promise<string> {
  if (primaryWallet?.signMessage) {
    return await primaryWallet.signMessage(message)
  }
  if (primaryWallet?.connector?.signMessage) {
    return await primaryWallet.connector.signMessage({ message })
  }
  if (primaryWallet?.provider?.request) {
    const from = primaryWallet.address
    return await primaryWallet.provider.request({
      method: 'personal_sign',
      params: [message, from],
    })
  }
  throw new Error('No signing method available')
}

export const MessageSigner: React.FC = () => {
  const { primaryWallet } = useDynamicContext()
  const [message, setMessage] = useState('')
  const [isSigning, setIsSigning] = useState(false)
  const [signature, setSignature] = useState('')
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const { verifySignature, isVerifying } = useMessageService()
  const { addMessage } = useMessageHistory()

  const handleSignMessage = async () => {
    if (!message.trim()) return

    if (!primaryWallet) {
      const failRes = {
        success: false,
        error: 'Wallet not connected',
        details: 'Please connect your wallet before signing',
      }
      setVerificationResult(failRes)
      // record failed attempt too
      addMessage({
        message,
        signature: '',
        recoveredAddress: '',
        verified: false,
        timestamp: new Date().toISOString(),
        verificationResult: failRes,
      })
      return
    }

    setIsSigning(true)
    setSignature('')
    setVerificationResult(null)

    try {
      const signedMessage = await signWithWallet(primaryWallet, message)
      setSignature(signedMessage)

      const result = await verifySignature(message, signedMessage)
      setVerificationResult(result)

      const recovered =
        result?.recoveredAddress ||
        result?.address ||
        primaryWallet?.address ||
        ''

      addMessage({
        message,
        signature: signedMessage,
        recoveredAddress: recovered,
        verified: !!result?.success || !!result?.verified,
        timestamp: new Date().toISOString(),
        verificationResult: result,
      })
    } catch (error: any) {
      console.error('Error signing message:', error)
      const failRes = {
        success: false,
        error: 'Failed to sign message',
        details: error?.message || 'Unknown error',
      }
      setVerificationResult(failRes)
      addMessage({
        message,
        signature: '',
        recoveredAddress: '',
        verified: false,
        timestamp: new Date().toISOString(),
        verificationResult: failRes,
      })
    } finally {
      setIsSigning(false)
    }
  }

  const handleClear = () => {
    setMessage('')
    setSignature('')
    setVerificationResult(null)
  }

  const canSign = message.trim().length > 0 && !!primaryWallet && !isSigning

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Sign Message
        </h2>
        <p className="text-gray-600">
          Type a message below and sign it with your embedded wallet
        </p>
      </div>

      {!primaryWallet && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Wallet Not Connected</h3>
              <p className="text-sm text-yellow-700">
                Please connect your wallet to sign messages
              </p>
            </div>
          </div>
        </div>
      )}

      <MessageInput
        value={message}
        onChange={setMessage}
        placeholder="Enter your message here..."
        disabled={!primaryWallet || isSigning}
      />

      <div className="flex space-x-3 mt-4">
        <button
          onClick={handleSignMessage}
          disabled={!canSign}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigning ? 'Signing...' : 'Sign Message'}
        </button>

        {(signature || verificationResult) && (
          <button onClick={handleClear} className="btn-secondary">
            Clear
          </button>
        )}
      </div>

      {signature && (
        <SignatureResult
          message={message}
          signature={signature}
          verificationResult={verificationResult}
          isVerifying={isVerifying}
        />
      )}
    </div>
  )
}
