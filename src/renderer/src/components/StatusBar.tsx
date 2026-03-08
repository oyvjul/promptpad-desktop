export default function StatusBar({ charCount, lineCount }: { charCount: number; lineCount: number }) {
  return (
    <div id="status-bar">
      <span>{lineCount} lines</span>
      <span>{charCount} chars</span>
    </div>
  )
}
