import path from 'node:path'
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
} from 'electron'

const isDev = import.meta.env.DEV

process.env.APP_ASAR = app.getAppPath()

export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
export const APP_ASAR = process.env.APP_ASAR
export const MAIN_DIST = path.join(APP_ASAR, 'dist-electron')
export const RENDERER_DIST = path.join(APP_ASAR, 'dist')

async function handleFileOpen(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({ title: 'Open File' })
  if (!canceled) {
    return filePaths[0]
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload', 'index.mjs'),
    },
  })

  // and load the index.html of the app.
  if (isDev) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL)// Open the DevTools.
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
