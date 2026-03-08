import { useEffect, useRef } from 'react'

export function useDoubleEscape() {
  const lastEscTime = useRef(0)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const now = Date.now()
        if (now - lastEscTime.current < 500) {
          window.electronAPI.hideApp()
        }
        lastEscTime.current = now
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
