interface ElectronAPI {
  copyToClipboard: (text: string) => void
  hideApp: () => void
  minimizeApp: () => void
  maximizeApp: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
