const { contextBridge, clipboard, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  copyToClipboard: (text) => clipboard.writeText(text),
  hideApp: () => ipcRenderer.send('app-hide'),
});
