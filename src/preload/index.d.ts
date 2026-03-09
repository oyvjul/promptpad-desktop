interface ElectronAPI {
  copyToClipboard: (text: string) => void
  hideApp: () => void
  minimizeApp: () => void
  maximizeApp: () => void
  platform: string
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
