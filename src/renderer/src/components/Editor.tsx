import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { highlightMarkdown } from '../utils/highlightMarkdown'
import { useDoubleEscape } from '../hooks/useDoubleEscape'
import { useEditorSync } from '../hooks/useEditorSync'
import AsciiPlaceholder from './AsciiPlaceholder'
import StatusBar from './StatusBar'

export default function Editor() {
  const [value, setValue] = useState('')
  const [currentLine, setCurrentLine] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  useDoubleEscape()
  useEditorSync(textareaRef, highlightRef, gutterRef)

  const highlightedHtml = useMemo(() => highlightMarkdown(value) + '\n', [value])

  const lines = value.split('\n')
  const lineCount = lines.length
  const digits = Math.max(2, String(lineCount).length)

  useEffect(() => {
    document.documentElement.style.setProperty('--gutter-width', digits * 9 + 20 + 'px')
  }, [digits])

  const updateCurrentLine = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    const line = textarea.value.substring(0, textarea.selectionStart).split('\n').length
    setCurrentLine(line)
  }, [])

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      updateCurrentLine()
    },
    [updateCurrentLine]
  )

  const handleSelect = useCallback(() => {
    updateCurrentLine()
  }, [updateCurrentLine])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      if (e.shiftKey) {
        const start = textarea.selectionStart
        const beforeCursor = textarea.value.substring(0, start)
        const lineStart = beforeCursor.lastIndexOf('\n') + 1
        const linePrefix = textarea.value.substring(lineStart, start)
        const match = linePrefix.match(/^ {1,2}/)
        if (match) {
          const spaces = match[0].length
          textarea.selectionStart = lineStart
          textarea.selectionEnd = lineStart + spaces
          document.execCommand('delete', false)
        }
      } else {
        document.execCommand('insertText', false, '  ')
      }
    }
  }, [])

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <>
      <div id="line-gutter" ref={gutterRef}>
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i} className={`line-number${i + 1 === currentLine ? ' active' : ''}`}>
            {i + 1}
          </span>
        ))}
      </div>
      <div
        id="highlight-overlay"
        ref={highlightRef}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        spellCheck={false}
      />
      <AsciiPlaceholder visible={value.length === 0} />
      <StatusBar charCount={value.length} lineCount={lineCount} />
    </>
  )
}
