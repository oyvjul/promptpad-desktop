import { app, BrowserWindow, globalShortcut, screen, clipboard, ipcMain } from 'electron'
import { join } from 'path'

let win: BrowserWindow

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.on('blur', () => {
    copyAndHide()
  })
}

function copyAndHide() {
  win.webContents
    .executeJavaScript('document.querySelector("textarea").value.trim()')
    .then((text: string) => {
      if (text) clipboard.writeText(text)
      win.hide()
    })
    .catch(() => win.hide())
}

function toggleWindow() {
  if (win.isVisible()) {
    copyAndHide()
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const bounds = win.getBounds()
    win.setPosition(
      Math.round((width - bounds.width) / 2),
      Math.round((height - bounds.height) / 2)
    )
    win.show()
  }
}

app.whenReady().then(() => {
  app.dock.hide()
  createWindow()
  globalShortcut.register('CommandOrControl+Shift+P', toggleWindow)
})

ipcMain.on('app-hide', () => {
  copyAndHide()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', (e: Event) => {
  e.preventDefault()
})
