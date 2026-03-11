import { useEffect, useState } from 'react'

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
  onNew: () => void
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
  onNew,
  onClose,
}: PromptListProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const sorted = [...prompts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  return (
    <>
      <div className="prompt-list-backdrop" onClick={onClose} />
      <div id="prompt-list" className={open ? 'open' : ''}>
        <div className="prompt-list-header">
          <span>Prompts</span>
          <button className="prompt-list-new" onClick={onNew}>
            + New
          </button>
        </div>
        <div className="prompt-list-items">
          {sorted.length === 0 && (
            <div className="prompt-list-empty">No saved prompts</div>
          )}
          {sorted.map((p) => (
            <div
              key={p.id}
              className={`prompt-list-item${p.id === currentPromptId ? ' active' : ''}`}
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
