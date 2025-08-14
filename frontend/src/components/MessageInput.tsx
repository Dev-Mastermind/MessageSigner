import React, { useState } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  placeholder = "Enter your message...",
  disabled = false
}) => {
  const [showWarning, setShowWarning] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    if (newValue.toLowerCase().includes('transaction') || 
        newValue.toLowerCase().includes('approve') ||
        newValue.toLowerCase().includes('transfer') ||
        newValue.toLowerCase().includes('0x')) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="input-field min-h-[120px] resize-none"
          rows={5}
        />
        <div className="absolute top-2 right-2">
          <div className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">
            {value.length}/10000
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900">Security Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                This message contains potentially sensitive content. Only sign messages you trust and understand.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Message Signing</h4>
            <p className="text-sm text-blue-700 mt-1">
              Signing a message proves you own the private key without revealing it. 
              This is safe and commonly used for authentication and verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
