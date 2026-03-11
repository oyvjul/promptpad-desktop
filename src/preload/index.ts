import { contextBridge, clipboard, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text: string) => clipboard.writeText(text),
  hideApp: () => ipcRenderer.send('app-hide'),
  minimizeApp: () => ipcRenderer.send('app-minimize'),
  maximizeApp: () => ipcRenderer.send('app-maximize'),
  platform: process.platform,
  prompts: {
    list: () => ipcRenderer.invoke('prompts:list'),
    save: (title: string, content: string) =>
      ipcRenderer.invoke('prompts:save', { title, content }),
    update: (id: string, fields: { title?: string; content?: string }) =>
      ipcRenderer.invoke('prompts:update', { id, ...fields }),
    delete: (id: string) => ipcRenderer.invoke('prompts:delete', { id }),
    load: (id: string) => ipcRenderer.invoke('prompts:load', { id }),
  },
})
