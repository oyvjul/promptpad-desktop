export default function TitleBar() {
  const prevent = (e: React.MouseEvent) => e.preventDefault();
  const isMac = window.electronAPI.platform === 'darwin';

  return (
    <div id="title-bar">
      {isMac ? (
        <>
          <div className="mac-controls">
            <button
              className="mac-btn mac-close"
              onMouseDown={prevent}
              onClick={() => window.electronAPI.hideApp()}
            >
              <svg className="mac-icon" viewBox="0 0 10 10" stroke="rgba(0,0,0,0.5)" strokeWidth="0.85" strokeLinecap="round">
                <line x1="2.5" y1="2.5" x2="7.5" y2="7.5" />
                <line x1="7.5" y1="2.5" x2="2.5" y2="7.5" />
              </svg>
            </button>
            <button
              className="mac-btn mac-minimize"
              onMouseDown={prevent}
              onClick={() => window.electronAPI.minimizeApp()}
            >
              <svg className="mac-icon" viewBox="0 0 10 10" stroke="rgba(0,0,0,0.5)" strokeWidth="0.85" strokeLinecap="round">
                <line x1="2" y1="5" x2="8" y2="5" />
              </svg>
            </button>
            <button
              className="mac-btn mac-maximize"
              onMouseDown={prevent}
              onClick={() => window.electronAPI.maximizeApp()}
            >
              <svg className="mac-icon" viewBox="0 0 10 10" fill="rgba(0,0,0,0.5)">
                <polygon points="6,1.5 8.5,1.5 8.5,4" />
                <polygon points="4,8.5 1.5,8.5 1.5,6" />
              </svg>
            </button>
          </div>
          <div id="drag-region" />
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
