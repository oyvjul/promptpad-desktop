import { useState, useEffect, useRef } from 'react'
import { encoding_for_model } from 'tiktoken'

const enc = encoding_for_model('gpt-4o')

export function useTokenCount(text: string): number {
  const [tokenCount, setTokenCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (!text) {
      setTokenCount(0)
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      setTokenCount(enc.encode(text).length)
    }, 300)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text])

  return tokenCount
}
