import { useState, useRef, useEffect } from 'react'

interface SaveDialogProps {
  defaultTitle: string
  onSave: (title: string) => void
  onCancel: () => void
}

export default function SaveDialog({ defaultTitle, onSave, onCancel }: SaveDialogProps) {
  const [title, setTitle] = useState(defaultTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (title.trim()) onSave(title.trim())
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <div id="save-dialog">
      <label>Save as:</label>
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onCancel}
        maxLength={60}
        placeholder="Prompt title..."
      />
    </div>
  )
}
