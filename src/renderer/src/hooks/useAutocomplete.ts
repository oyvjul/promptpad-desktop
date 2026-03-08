import { useState, useRef, useCallback, useEffect } from 'react'

export function useAutocomplete(value: string, cursorAtEnd: boolean) {
  const [suggestion, setSuggestion] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Clear suggestion immediately on any text change
    setSuggestion('')

    // Cancel in-flight request
    abortRef.current?.abort()
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!value.trim() || !cursorAtEnd) return

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch('http://localhost:8080/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: value }),
          signal: controller.signal
        })
        if (!controller.signal.aborted && res.ok) {
          const data = await res.json()
          if (!controller.signal.aborted && data.response) {
            setSuggestion(data.response)
          }
        }
      } catch {
        // Aborted or network error — ignore
      }
    }, 300)

    return () => {
      abortRef.current?.abort()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, cursorAtEnd])

  const clearSuggestion = useCallback(() => setSuggestion(''), [])

  return { suggestion, clearSuggestion }
}
