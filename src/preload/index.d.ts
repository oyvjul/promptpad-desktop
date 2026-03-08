interface ElectronAPI {
  copyToClipboard: (text: string) => void
  hideApp: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
