const textarea = document.querySelector("textarea");
const highlightOverlay = document.getElementById("highlight-overlay");
const lineGutter = document.getElementById("line-gutter");

function updateHighlight() {
  highlightOverlay.innerHTML = highlightMarkdown(textarea.value) + "\n";
}

function getCurrentLine() {
  return textarea.value.substring(0, textarea.selectionStart).split("\n")
    .length;
}

let _prevLineCount = 0;
let _prevCurrentLine = 0;

function updateLineNumbers() {
  const lineCount = textarea.value.split("\n").length;
  const currentLine = getCurrentLine();

  const digits = Math.max(2, String(lineCount).length);
  document.documentElement.style.setProperty(
    "--gutter-width",
    digits * 9 + 20 + "px",
  );

  if (lineCount !== _prevLineCount) {
    let html = "";
    for (let i = 1; i <= lineCount; i++) {
      const cls =
        i === currentLine ? "line-number active" : "line-number";
      html += `<span class="${cls}">${i}</span>`;
    }
    lineGutter.innerHTML = html;
    _prevLineCount = lineCount;
  } else if (currentLine !== _prevCurrentLine) {
    if (_prevCurrentLine > 0 && lineGutter.children[_prevCurrentLine - 1])
      lineGutter.children[_prevCurrentLine - 1].classList.remove(
        "active",
      );
    if (lineGutter.children[currentLine - 1])
      lineGutter.children[currentLine - 1].classList.add("active");
  }
  _prevCurrentLine = currentLine;
}

textarea.addEventListener("input", () => {
  updatePlaceholderVisibility(textarea.value.length > 0);
  updateHighlight();
  updateLineNumbers();
});

textarea.addEventListener("scroll", () => {
  highlightOverlay.scrollTop = textarea.scrollTop;
  highlightOverlay.scrollLeft = textarea.scrollLeft;
  lineGutter.scrollTop = textarea.scrollTop;
});

updateHighlight();
updateLineNumbers();

document.addEventListener("selectionchange", () => {
  if (document.activeElement === textarea) {
    updateLineNumbers();
  }
});

textarea.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    if (e.shiftKey) {
      const start = textarea.selectionStart;
      const beforeCursor = textarea.value.substring(0, start);
      const lineStart = beforeCursor.lastIndexOf("\n") + 1;
      const linePrefix = textarea.value.substring(lineStart, start);
      if (linePrefix.match(/^ {1,2}/)) {
        const spaces = linePrefix.match(/^ {1,2}/)[0].length;
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + spaces;
        document.execCommand("delete", false);
      }
    } else {
      document.execCommand("insertText", false, "  ");
    }
  }
});

let lastEscTime = 0;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const now = Date.now();
    if (now - lastEscTime < 500) {
      window.electronAPI.hideApp();
    }
    lastEscTime = now;
  }
});
