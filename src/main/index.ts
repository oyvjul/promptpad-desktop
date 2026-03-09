import {
  app,
  BrowserWindow,
  globalShortcut,
  screen,
  clipboard,
  ipcMain,
} from "electron";
import { join } from "path";

let win: BrowserWindow;

const isMac = process.platform === 'darwin';

const platformOptions = isMac
  ? {
      vibrancy: 'under-window' as const,
      visualEffectState: 'active' as const,
      backgroundColor: '#00000000',
    }
  : {
      transparent: true,
      backgroundColor: '#00000000',
      backgroundMaterial: 'acrylic' as const,
    };

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    ...platformOptions,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  if (!isMac) {
    const buildNumber = parseInt(require('os').release().split('.')[2], 10);
    if (buildNumber < 22621) {
      win.setBackgroundColor('#FF1a1a1a');
    }
  }

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  win.on("blur", () => {
    copyAndHide();
  });

  win.on('show', () => {
    win.webContents.focus();
    win.webContents.executeJavaScript(
      'document.querySelector("textarea")?.focus()'
    );
  });
}

function copyAndHide() {
  win.webContents
    .executeJavaScript('document.querySelector("textarea").value.trim()')
    .then((text: string) => {
      if (text) clipboard.writeText(text);
      win.hide();
    })
    .catch(() => win.hide());
}

function toggleWindow() {
  if (win.isVisible()) {
    copyAndHide();
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const bounds = win.getBounds();
    win.setPosition(
      Math.round((width - bounds.width) / 2),
      Math.round((height - bounds.height) / 2),
    );
    win.show();
  }
}

app.whenReady().then(() => {
  app.dock?.hide();
  createWindow();
  globalShortcut.register("CommandOrControl+Shift+P", toggleWindow);
});

ipcMain.on("app-hide", () => {
  copyAndHide();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", (e: Event) => {
  e.preventDefault();
});
