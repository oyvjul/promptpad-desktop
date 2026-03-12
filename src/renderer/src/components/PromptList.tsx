import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface StoredPrompt {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface PromptListProps {
  prompts: StoredPrompt[]
  currentPromptId: string | null
  isOpen: boolean
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onClose: () => void
  onExited: () => void
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function PromptList({
  prompts,
  currentPromptId,
  isOpen,
  onLoad,
  onDelete,
  onClose,
  onExited,
}: PromptListProps) {
  const [visible, setVisible] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const hasExitedRef = useRef(false)
  const sorted = useMemo(
    () =>
      [...prompts].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [prompts],
  )

  const initialIndex = Math.max(0, sorted.findIndex((p) => p.id === currentPromptId))
  const [highlightedIndex, setHighlightedIndex] = useState(initialIndex)
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const setItemRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) itemRefs.current.set(index, el)
    else itemRefs.current.delete(index)
  }, [])

  useEffect(() => {
    itemRefs.current.get(highlightedIndex)?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex])

  // Trigger enter animation on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Trigger exit animation when isOpen becomes false
  useEffect(() => {
    if (!isOpen) {
      setVisible(false)
      hasExitedRef.current = false
      // Safety timeout in case transitionend doesn't fire
      const timeout = setTimeout(() => {
        if (!hasExitedRef.current) {
          hasExitedRef.current = true
          onExited()
        }
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, onExited])

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName === 'transform' && !isOpen && !hasExitedRef.current) {
        hasExitedRef.current = true
        onExited()
      }
    },
    [isOpen, onExited],
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((i) => (sorted.length === 0 ? 0 : (i + 1) % sorted.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((i) =>
          sorted.length === 0 ? 0 : (i - 1 + sorted.length) % sorted.length,
        )
      } else if (e.key === 'Enter') {
        if (sorted.length > 0) onLoad(sorted[highlightedIndex].id)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onLoad, sorted, highlightedIndex])

  return (
    <>
      <div className={`prompt-list-backdrop${visible ? ' visible' : ''}`} onClick={onClose} />
      <div
        id="prompt-list"
        ref={panelRef}
        className={visible ? 'open' : ''}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="prompt-list-items">
          {sorted.length === 0 && (
            <div className="prompt-list-empty">No saved prompts</div>
          )}
          {sorted.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => setItemRef(i, el)}
              className={`prompt-list-item${p.id === currentPromptId ? ' active' : ''}${i === highlightedIndex ? ' highlighted' : ''}`}
              onClick={() => onLoad(p.id)}
            >
              <div className="prompt-item-top">
                <span className="prompt-item-title">{p.title}</span>
                <button
                  className="prompt-item-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(p.id)
                  }}
                >
                  &times;
                </button>
              </div>
              <div className="prompt-item-meta">
                <span className="prompt-item-date">{relativeDate(p.updatedAt)}</span>
                <span className="prompt-item-preview">
                  {p.content.replace(/\n/g, ' ').slice(0, 40)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
