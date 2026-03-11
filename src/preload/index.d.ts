interface StoredPrompt {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

interface ElectronAPI {
  copyToClipboard: (text: string) => void
  hideApp: () => void
  minimizeApp: () => void
  maximizeApp: () => void
  platform: string
  prompts: {
    list: () => Promise<StoredPrompt[]>
    save: (title: string, content: string) => Promise<StoredPrompt>
    update: (id: string, fields: { title?: string; content?: string }) => Promise<StoredPrompt | null>
    delete: (id: string) => Promise<boolean>
    load: (id: string) => Promise<StoredPrompt | null>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    __currentPromptId?: string | null
  }
}

export {}
