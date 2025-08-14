import React, { useState } from 'react'
import { useMessageHistory } from '../hooks/useMessageHistory'
import { History, Trash2, Copy, ExternalLink, CheckCircle, XCircle } from 'lucide-react'

export const MessageHistory: React.FC = () => {
  const { messages, clearHistory } = useMessageHistory()
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const toggleExpanded = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId)
  }

  if (messages.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
          <p className="text-gray-500">
            Sign your first message to see it appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Message History
          </h2>
          <p className="text-gray-600">
            {messages.length} message{messages.length !== 1 ? 's' : ''} signed
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {msg.verified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${msg.verified ? 'text-green-600' : 'text-red-600'}`}>
                    {msg.verified ? 'Verified' : 'Failed'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>

                <div className="mb-3">
                  <h4 className="font-medium text-gray-900 mb-1">Message</h4>
                  <p className="text-gray-700 text-sm break-words">
                    {msg.message.length > 100 
                      ? `${msg.message.substring(0, 100)}...` 
                      : msg.message
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Address: </span>
                    <span className="font-mono text-gray-800">
                      {formatAddress(msg.recoveredAddress)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Signature: </span>
                    <span className="font-mono text-gray-800">
                      {msg.signature.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={() => toggleExpanded(`${msg.timestamp}-${index}`)}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  {expandedMessage === `${msg.timestamp}-${index}` ? 'Show Less' : 'Show More'}
                </button>
                
                <button
                  onClick={() => copyToClipboard(msg.signature)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy signature"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {expandedMessage === `${msg.timestamp}-${index}` && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Full Message</h5>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-800 break-words">
                    {msg.message}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Full Signature</h5>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono text-gray-800 break-all">
                    {msg.signature}
                  </div>
                </div>

                {msg.verified && msg.recoveredAddress && (
                  <div className="pt-2">
                    <a
                      href={`https://etherscan.io/address/${msg.recoveredAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                    >
                      <span>View Address on Etherscan</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
