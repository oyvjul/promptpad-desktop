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
  onLoad: (id: string) => void
  onDelete: (id: string) => void
  onClose: () => void
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
  onLoad,
  onDelete,
  onClose,
}: PromptListProps) {
  const [open, setOpen] = useState(false)
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

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

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
      <div className="prompt-list-backdrop" onClick={onClose} />
      <div id="prompt-list" className={open ? 'open' : ''}>
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
