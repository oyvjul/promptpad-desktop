import { useState, useCallback } from 'react'

interface StoredPrompt {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export function usePromptStorage() {
  const [currentPromptId, setCurrentPromptId] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<StoredPrompt[]>([])
  const [savedFlash, setSavedFlash] = useState(false)

  const refresh = useCallback(async () => {
    const list = await window.electronAPI.prompts.list()
    setPrompts(list)
  }, [])

  const save = useCallback(async (title: string, content: string) => {
    const prompt = await window.electronAPI.prompts.save(title, content)
    setCurrentPromptId(prompt.id)
    setCurrentTitle(prompt.title)
    // Expose to main process for auto-save on hide
    ;(window as any).__currentPromptId = prompt.id
    await refresh()
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
    return prompt
  }, [refresh])

  const update = useCallback(async (id: string, fields: { title?: string; content?: string }) => {
    const prompt = await window.electronAPI.prompts.update(id, fields)
    if (prompt) {
      setCurrentTitle(prompt.title)
      await refresh()
      setSavedFlash(true)
      setTimeout(() => setSavedFlash(false), 2000)
    }
    return prompt
  }, [refresh])

  const load = useCallback(async (id: string) => {
    const prompt = await window.electronAPI.prompts.load(id)
    if (prompt) {
      setCurrentPromptId(prompt.id)
      setCurrentTitle(prompt.title)
      ;(window as any).__currentPromptId = prompt.id
    }
    return prompt
  }, [])

  const remove = useCallback(async (id: string) => {
    await window.electronAPI.prompts.delete(id)
    if (currentPromptId === id) {
      setCurrentPromptId(null)
      setCurrentTitle(null)
      ;(window as any).__currentPromptId = null
    }
    await refresh()
  }, [currentPromptId, refresh])

  const clearCurrent = useCallback(() => {
    setCurrentPromptId(null)
    setCurrentTitle(null)
    ;(window as any).__currentPromptId = null
  }, [])

  return {
    currentPromptId,
    currentTitle,
    prompts,
    savedFlash,
    refresh,
    save,
    update,
    load,
    remove,
    clearCurrent,
  }
}
