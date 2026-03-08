function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function storePlaceholder(placeholders: string[], html: string): string {
  const token = `\x00${placeholders.length}\x00`;
  placeholders.push(html);
  return token;
}

function highlightLine(rawLine: string): string {
  let line = escapeHtml(rawLine);
  const placeholders: string[] = [];

  // Inline code
  line = line.replace(/(`+)(.*?)\1/g, (_m, ticks: string, content: string) =>
    storePlaceholder(
      placeholders,
      `<span class="md-dim">${ticks}</span><span class="md-code">${content}</span><span class="md-dim">${ticks}</span>`,
    ),
  );

  // Links [text](url)
  line = line.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    (_m, text: string, url: string) =>
      storePlaceholder(
        placeholders,
        `<span class="md-dim">[</span><span class="md-link-text">${text}</span><span class="md-dim">](</span><span class="md-link-url">${url}</span><span class="md-dim">)</span>`,
      ),
  );

  // Bold **text** or __text__
  line = line.replace(
    /(\*\*|__)(.+?)\1/g,
    (_m, marker: string, content: string) =>
      storePlaceholder(
        placeholders,
        `<span class="md-dim">${marker}</span><span class="md-bold">${content}</span><span class="md-dim">${marker}</span>`,
      ),
  );

  // Italic *text* or _text_
  line = line.replace(/(\*|_)(.+?)\1/g, (_m, marker: string, content: string) =>
    storePlaceholder(
      placeholders,
      `<span class="md-dim">${marker}</span><span class="md-italic">${content}</span><span class="md-dim">${marker}</span>`,
    ),
  );

  // Restore placeholders
  line = line.replace(
    /\x00(\d+)\x00/g,
    (_m, i: string) => placeholders[parseInt(i)],
  );

  // Block-level patterns (check against raw line)
  // Horizontal rule
  if (/^(\s*[-*_]\s*){3,}$/.test(rawLine)) {
    return `<span class="md-hr">${line}</span>`;
  }
  // Headers
  const headerMatch = rawLine.match(/^(#{1,6})\s/);
  if (headerMatch) {
    const level = headerMatch[1].length;
    const marker = escapeHtml(headerMatch[1]) + " ";
    const rest = line.slice(marker.length);
    return `<span class="md-h-marker">${marker}</span><span class="md-h${level}">${rest}</span>`;
  }
  // Blockquote
  if (rawLine.match(/^>\s?/)) {
    const markerMatch = line.match(/^(&gt;)\s?/);
    if (markerMatch) {
      const marker = markerMatch[0];
      const rest = line.slice(marker.length);
      return `<span class="md-blockquote-marker">${marker}</span><span class="md-blockquote-text">${rest}</span>`;
    }
  }
  // Unordered list
  const ulMatch = rawLine.match(/^(\s*[-*+])\s/);
  if (ulMatch) {
    const markerLen = escapeHtml(ulMatch[1]).length + 1;
    return `<span class="md-list-marker">${line.slice(0, markerLen)}</span>${line.slice(markerLen)}`;
  }
  // Ordered list
  const olMatch = rawLine.match(/^(\s*\d+\.)\s/);
  if (olMatch) {
    const markerLen = olMatch[1].length + 1;
    return `<span class="md-list-marker">${line.slice(0, markerLen)}</span>${line.slice(markerLen)}`;
  }

  return line;
}

export function highlightMarkdown(text: string): string {
  return text.split("\n").map(highlightLine).join("\n");
}
