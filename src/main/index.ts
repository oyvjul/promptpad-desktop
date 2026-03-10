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
let isMinimizing = false;

function getPlatformOptions() {
  if (process.platform === "darwin") {
    return {
      vibrancy: "under-window" as const,
      visualEffectState: "active" as const,
      backgroundColor: "#00000000",
    };
  }
  if (process.platform === "win32") {
    return {
      backgroundColor: "#00000000",
      backgroundMaterial: "mica" as const,
      // DO NOT set transparent: true — it conflicts with backgroundMaterial
    };
  }
  // Linux: plain transparency, no blur API available
  return {
    transparent: true,
    backgroundColor: "#00000000",
  };
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    ...getPlatformOptions(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }

  win.on("blur", () => {
    if (isMinimizing) return;
    copyAndHide();
  });

  // Workaround for Electron < 36 frameless backgroundMaterial bug:
  // DWM composition doesn't apply until a resize triggers recomposition.
  win.once("ready-to-show", () => {
    if (process.platform === "win32") {
      const bounds = win.getBounds();
      win.setBounds({ width: bounds.width + 1 });
      win.setBounds({ width: bounds.width });
    }
  });

  win.on("show", () => {
    // Reapply resize nudge on show — acrylic can vanish after hide/show cycles
    if (process.platform === "win32") {
      const bounds = win.getBounds();
      win.setBounds({ width: bounds.width + 1 });
      win.setBounds({ width: bounds.width });
    }
    win.webContents.focus();
    win.webContents.executeJavaScript(
      'document.querySelector("textarea")?.focus()',
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

let hasBeenShown = false;

function toggleWindow() {
  if (win.isVisible()) {
    copyAndHide();
  } else {
    if (!hasBeenShown) {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      const bounds = win.getBounds();
      win.setPosition(
        Math.round((width - bounds.width) / 2),
        Math.round((height - bounds.height) / 2),
      );
      hasBeenShown = true;
    }
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

ipcMain.on("app-minimize", () => {
  isMinimizing = true;
  win.minimize();
  setTimeout(() => { isMinimizing = false; }, 100);
});

ipcMain.on("app-maximize", () => {
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", (e: Event) => {
  e.preventDefault();
});
