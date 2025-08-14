export interface MessageRequest {
  message: string
  signature: string
}

export interface MessageData {
  message: string
  signature: string
  recoveredAddress: string
  verified: boolean
  timestamp: string
}

export interface MessageResponse {
  success: boolean
  data?: MessageData
  error?: string
  details?: unknown
}
