/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ipcRenderer, IpcRenderer } from 'electron'
import { PythonShell } from "python-shell"
import { ChildProcess } from "child_process"

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer
      // pyShell: PythonShell|null
      runner: PythonShell|ChildProcess|null
    }
  }
}

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer
})
