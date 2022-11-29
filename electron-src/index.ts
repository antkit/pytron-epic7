// Native
import * as path from "path";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

import {RunProps, pyRun, UpdateProps, updateEnvironment} from './pyer'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    width: isDev ? 1440 : 800,
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:18123/test");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL("https://epic7.joyqoo.com");
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  if (isDev) {
    await prepareNext("./renderer");
  }

  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on("message", (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send("message", "hi from electron"), 500);
});

// message: likes "easyocr,PyAutoGUI==0.9.53"
ipcMain.on("update", (event: IpcMainEvent, props: UpdateProps) => {
  console.log("-> update:", props);
  updateEnvironment(event, props);
});

ipcMain.on("run", (event: IpcMainEvent, props: RunProps) => {
  console.log("-> run:", props);
  pyRun(event, props);
})
