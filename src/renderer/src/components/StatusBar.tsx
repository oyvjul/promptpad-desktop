export default function StatusBar({
  charCount,
  lineCount,
  tokenCount,
  promptTitle,
  savedFlash,
}: {
  charCount: number
  lineCount: number
  tokenCount: number
  promptTitle: string | null
  savedFlash: boolean
}) {
  return (
    <div id="status-bar">
      <span>
        {promptTitle && <span className="status-prompt-title">{promptTitle}</span>}
        {savedFlash && <span className="status-saved">Saved</span>}
        {!promptTitle && !savedFlash && <>{lineCount} lines</>}
      </span>
      <span>{charCount} chars · {tokenCount} tokens</span>
    </div>
  )
}
