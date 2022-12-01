// Native
import * as path from "path";

// Packages
import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

import { Configs } from "./common";
import { pytronHandler } from "./pytron";

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
    mainWindow.loadURL("http://localhost:18123/pyer/env");
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

// listen the channels and call handlers process received messages
ipcMain.on(Configs.ChannelPytron, pytronHandler);
