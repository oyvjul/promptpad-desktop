import { useEffect, RefObject } from 'react'

export function useEditorSync(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  highlightRef: RefObject<HTMLDivElement | null>,
  gutterRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    function handleScroll() {
      if (highlightRef.current) {
        highlightRef.current.scrollTop = textarea!.scrollTop
        highlightRef.current.scrollLeft = textarea!.scrollLeft
      }
      if (gutterRef.current) {
        gutterRef.current.scrollTop = textarea!.scrollTop
      }
    }

    textarea.addEventListener('scroll', handleScroll)
    return () => textarea.removeEventListener('scroll', handleScroll)
  }, [textareaRef, highlightRef, gutterRef])
}
