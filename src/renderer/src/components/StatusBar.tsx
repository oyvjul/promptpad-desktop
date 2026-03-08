export default function StatusBar({ charCount, lineCount, tokenCount }: { charCount: number; lineCount: number; tokenCount: number }) {
  return (
    <div id="status-bar">
      <span>{lineCount} lines</span>
      <span>{charCount} chars · {tokenCount} tokens</span>
    </div>
  )
}
