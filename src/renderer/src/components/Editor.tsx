import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { highlightMarkdown } from "../utils/highlightMarkdown";
import { useDoubleEscape } from "../hooks/useDoubleEscape";
import { useEditorSync } from "../hooks/useEditorSync";
import { useTokenCount } from "../hooks/useTokenCount";
import { usePromptStorage } from "../hooks/usePromptStorage";
import StatusBar from "./StatusBar";
import AsciiPlaceholder from "./AsciiPlaceholder";
import TitleBar from "./TitleBar";
import SaveDialog from "./SaveDialog";
import PromptList from "./PromptList";

export default function Editor() {
  const [value, setValue] = useState("");
  const [currentLine, setCurrentLine] = useState(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  useDoubleEscape();
  useEditorSync(textareaRef, highlightRef, gutterRef);
  const tokenCount = useTokenCount(value);
  const storage = usePromptStorage();

  const highlightedHtml = useMemo(
    () => highlightMarkdown(value) + "\n",
    [value],
  );

  const lines = value.split("\n");
  const lineCount = lines.length;
  const digits = Math.max(2, String(lineCount).length);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--gutter-width",
      digits * 9 + 20 + "px",
    );
  }, [digits]);

  const updateCurrentLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const line = textarea.value
      .substring(0, textarea.selectionStart)
      .split("\n").length;
    setCurrentLine(line);
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      updateCurrentLine();
    },
    [updateCurrentLine],
  );

  const handleSelect = useCallback(() => {
    updateCurrentLine();
  }, [updateCurrentLine]);

  const deriveTitle = useCallback((text: string) => {
    const firstLine = text.split("\n")[0].replace(/^#+\s*/, "").trim();
    return firstLine.slice(0, 60) || "Untitled";
  }, []);

  const handleSave = useCallback(() => {
    if (storage.currentPromptId) {
      storage.update(storage.currentPromptId, { content: value });
    } else {
      if (value.trim()) {
        setShowSaveDialog(true);
      }
    }
  }, [storage, value]);

  const handleSaveConfirm = useCallback(
    (title: string) => {
      setShowSaveDialog(false);
      storage.save(title, value);
      textareaRef.current?.focus();
    },
    [storage, value],
  );

  const handleSaveCancel = useCallback(() => {
    setShowSaveDialog(false);
    textareaRef.current?.focus();
  }, []);

  const handleLoadPrompt = useCallback(
    async (id: string) => {
      const prompt = await storage.load(id);
      if (prompt) {
        setValue(prompt.content);
        setShowPromptList(false);
        textareaRef.current?.focus();
      }
    },
    [storage],
  );

  const handleNewPrompt = useCallback(() => {
    setValue("");
    storage.clearCurrent();
    setShowPromptList(false);
    textareaRef.current?.focus();
  }, [storage]);

  const togglePromptList = useCallback(() => {
    setShowPromptList((prev) => {
      if (!prev) storage.refresh();
      return !prev;
    });
  }, [storage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const textarea = e.currentTarget;
        if (e.shiftKey) {
          const start = textarea.selectionStart;
          const beforeCursor = textarea.value.substring(0, start);
          const lineStart = beforeCursor.lastIndexOf("\n") + 1;
          const linePrefix = textarea.value.substring(lineStart, start);
          const match = linePrefix.match(/^ {1,2}/);
          if (match) {
            const spaces = match[0].length;
            textarea.selectionStart = lineStart;
            textarea.selectionEnd = lineStart + spaces;
            document.execCommand("delete", false);
          }
        } else {
          document.execCommand("insertText", false, "  ");
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "o") {
        e.preventDefault();
        togglePromptList();
      }
    },
    [handleSave, togglePromptList],
  );

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      <TitleBar onTogglePromptList={togglePromptList} />
      {showSaveDialog && (
        <SaveDialog
          defaultTitle={deriveTitle(value)}
          onSave={handleSaveConfirm}
          onCancel={handleSaveCancel}
        />
      )}
      {showPromptList && (
        <PromptList
          prompts={storage.prompts}
          currentPromptId={storage.currentPromptId}
          onLoad={handleLoadPrompt}
          onDelete={storage.remove}
          onNew={handleNewPrompt}
          onClose={() => setShowPromptList(false)}
        />
      )}
      <div id="line-gutter" ref={gutterRef}>
        {Array.from({ length: lineCount }, (_, i) => (
          <span
            key={i}
            className={`line-number${i + 1 === currentLine ? " active" : ""}`}
          >
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
      <StatusBar
        charCount={value.length}
        lineCount={lineCount}
        tokenCount={tokenCount}
        promptTitle={storage.currentTitle}
        savedFlash={storage.savedFlash}
      />
    </>
  );
}
