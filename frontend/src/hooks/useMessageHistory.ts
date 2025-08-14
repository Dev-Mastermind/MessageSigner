
import { useState, useEffect, useCallback, useRef } from 'react'

export interface MessageHistoryItem {
  id?: string
  message: string
  signature: string
  recoveredAddress: string
  verified: boolean
  timestamp: string
  verificationResult: any
}

const STORAGE_KEY = 'web3_message_history'
const MAX_HISTORY = 100
const CHANNEL_NAME = 'web3_message_history_channel'

function safeParse<T>(val: string | null, fallback: T): T {
  try {
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

function makeId(item: Omit<MessageHistoryItem, 'id'>): string {

  const sig = item.signature || 'nosig'
  const addr = item.recoveredAddress || 'noaddr'
  return `${sig}|${addr}|${item.message}`
}

function normalize(items: MessageHistoryItem[]): MessageHistoryItem[] {
  const seen = new Set<string>()
  const result: MessageHistoryItem[] = []
  for (const raw of items) {
    const base = { ...raw }
    const id = base.id || makeId(base)
    if (seen.has(id)) continue
    seen.add(id)
    result.push({ ...base, id })
  }
  return result
}

function readFromStorage(): MessageHistoryItem[] {
  const parsed = safeParse<MessageHistoryItem[]>(
    localStorage.getItem(STORAGE_KEY),
    []
  )
  return Array.isArray(parsed) ? normalize(parsed) : []
}

function writeToStorage(items: MessageHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
  }
}

export const useMessageHistory = () => {
  const [messages, setMessages] = useState<MessageHistoryItem[]>([])
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    setMessages(readFromStorage())
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME)
      ch.onmessage = (ev) => {
        if (ev?.data?.type === 'history-updated') {
          setMessages(readFromStorage())
        }
      }
      channelRef.current = ch
      return () => ch.close()
    } catch {
      channelRef.current = null
    }
  }, [])

  const notify = useCallback(() => {
    try {
      channelRef.current?.postMessage({ type: 'history-updated' })
    } catch {}
  }, [])

  const addMessage = useCallback((item: Omit<MessageHistoryItem, 'id'>) => {
    const current = readFromStorage()
    const newId = makeId(item)
    const exists = current.some(m => m.id === newId)
    const next = exists ? current : [{ ...item, id: newId }, ...current]
    const limited = next.length > MAX_HISTORY ? next.slice(0, MAX_HISTORY) : next
    writeToStorage(limited)
    setMessages(limited)
    notify()
  }, [notify])

  const clearHistory = useCallback(() => {
    writeToStorage([])
    setMessages([])
    notify()
  }, [notify])

  const removeMessage = useCallback((_timestamp: string, index: number) => {
    const current = readFromStorage()
    const filtered = current.filter((_, i) => i !== index)
    writeToStorage(filtered)
    setMessages(filtered)
    notify()
  }, [notify])

  const getMessageById = useCallback((_timestamp: string, index: number) => {
    return messages.find((_, i) => i === index)
  }, [messages])

  return {
    messages,
    addMessage,
    clearHistory,
    removeMessage,
    getMessageById
  }
}
