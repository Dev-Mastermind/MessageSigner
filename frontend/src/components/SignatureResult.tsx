import React from 'react'
import { CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react'
import { useMessageHistory } from '../hooks/useMessageHistory'

interface SignatureResultProps {
  message: string
  signature: string
  verificationResult: any
  isVerifying: boolean
}

export const SignatureResult: React.FC<SignatureResultProps> = ({
  message,
  signature,
  verificationResult,
  isVerifying
}) => {
  const { addMessage } = useMessageHistory()
  const lastSavedSig = React.useRef<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatAddress = (address: string) => {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = () => {
    if (isVerifying) {
      return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
    }
    if (verificationResult?.success) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusText = () => {
    if (isVerifying) return 'Verifying...'
    if (verificationResult?.success) return 'Signature Verified'
    return 'Verification Failed'
  }

  const getStatusColor = () => {
    if (isVerifying) return 'text-gray-600'
    if (verificationResult?.success) return 'text-green-600'
    return 'text-red-600'
  }

  React.useEffect(() => {
    if (!verificationResult || isVerifying) return
    if (!signature) return
    if (lastSavedSig.current === signature) return

    lastSavedSig.current = signature
    addMessage({
      message,
      signature,
      recoveredAddress: verificationResult.data?.recoveredAddress || 'Unknown',
      verified: !!verificationResult.success,
      timestamp: new Date().toISOString(),
      verificationResult
    })
  }, [verificationResult, isVerifying, signature, addMessage, message])

  return (
    <div className="mt-6 space-y-4">
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Signature Result</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono text-gray-800 break-all">
                {signature}
              </code>
              <button
                onClick={() => copyToClipboard(signature)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy signature"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {verificationResult && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Details
              </label>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                {verificationResult.success ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Recovered Address:</span>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-gray-800">
                          {formatAddress(verificationResult.data?.recoveredAddress)}
                        </code>
                        {verificationResult.data?.recoveredAddress && (
                          <button
                            onClick={() => copyToClipboard(verificationResult.data.recoveredAddress)}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            title="Copy address"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timestamp:</span>
                      <span className="text-sm text-gray-800">
                        {verificationResult.data?.timestamp
                          ? new Date(verificationResult.data.timestamp).toLocaleString()
                          : 'Not provided'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-red-600 text-sm">
                    {verificationResult.error}: {verificationResult.details}
                  </div>
                )}
              </div>
            </div>
          )}

          {verificationResult?.success && verificationResult.data?.recoveredAddress && (
            <div className="pt-2">
              <a
                href={`https://etherscan.io/address/${verificationResult.data.recoveredAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
              >
                <span>View on Etherscan</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
