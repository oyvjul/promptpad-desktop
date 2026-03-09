import { contextBridge, clipboard, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text: string) => clipboard.writeText(text),
  hideApp: () => ipcRenderer.send('app-hide'),
  minimizeApp: () => ipcRenderer.send('app-minimize'),
  maximizeApp: () => ipcRenderer.send('app-maximize'),
  platform: process.platform,
})
