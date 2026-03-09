export default function TitleBar() {
  const prevent = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div id="title-bar">
      <div id="drag-region" />
      <div id="window-controls">
        <button
          className="win-ctrl"
          onMouseDown={prevent}
          onClick={() => window.electronAPI.minimizeApp()}
        >
          <svg viewBox="0 0 10 10">
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button
          className="win-ctrl"
          onMouseDown={prevent}
          onClick={() => window.electronAPI.maximizeApp()}
        >
          <svg viewBox="0 0 10 10">
            <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button
          className="win-ctrl"
          id="btn-close"
          onMouseDown={prevent}
          onClick={() => window.electronAPI.hideApp()}
        >
          <svg viewBox="0 0 10 10">
            <line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" />
            <line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
