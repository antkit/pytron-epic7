import * as path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { Options, PythonShell } from "python-shell";
import { app, IpcMainEvent } from "electron";
import { URL } from "url";
import * as http from "http";
import * as https from "https";

import { Paths, Configs } from "./common";

const dRoot = path.join(app.getPath("home"), Paths.Root);

enum Commands {
  DetectPython3 = "detectPython3", // 检测系统Python环境
  Init = "init", // 初始化pytron环境
  Remove = "remove", // 移除pytron环境
  ReadConfig = "readConfig", // 读取配置文件
  WriteConfig = "writeConfig", // 写入配置文件
  Download = "download", // 下载资源、代码文件
  RunPysh = "runPysh", // python-shell执行venv下的python
  RunBin = "runBin",
}

enum Status {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Done = "done",
}

class Config {
  version: string = "";
  packages: string[] = [];
}

const channelName = Configs.ChannelPytron;

// message: likes "easyocr,PyAutoGUI==0.9.53"
export function pytronHandler(
  event: IpcMainEvent,
  cmd: Commands,
  data?: Object
) {
  console.log("-> " + channelName + ":" + data ? data : "");
  switch (cmd) {
    case Commands.DetectPython3:
      detectPython3(event);
      break;
    case Commands.Init:
      init(event, data as InitProps);
      break;
    case Commands.Remove:
      remove(event);
      break;
    case Commands.RunPysh:
      runPysh(event, data as RunProps);
      break;
    case Commands.ReadConfig:
      readConfig(event);
      break;
    case Commands.WriteConfig:
      writeConfig(event);
      break;
    case Commands.Download:
      download(event, data as DownloadProps);
      break;
    case Commands.RunBin:
      runBin(event, data as RunProps);
      break;
    default:
      console.error("unsupported command", cmd);
      break;
  }
}

// Send message to event's sender
function reply(
  event: IpcMainEvent,
  channel: string,
  command: Commands,
  result: Status,
  data?: any
) {
  const message = {
    command,
    time: new Date(),
    result,
    data: data ? data : {},
  };
  event.sender.send(channel, message);
}

function detectPython3(event: IpcMainEvent) {
  console.log("-> pytron detectPython3");
  const p: ChildProcess = spawn("python3", ["--version"]);
  p.stdout?.on("data", (data: string) => {
    // data would likes as 'Python 3.9.6'
    const msg = ("" + data).trim();
    console.log("data:", msg);
    reply(event, channelName, Commands.DetectPython3, Status.Info, msg);
  });
  p.on("error", (err) => {
    console.log("error", err);
    reply(event, channelName, Commands.DetectPython3, Status.Error);
  });
  p.on("exit", () => {
    console.log("exit");
    reply(event, channelName, Commands.DetectPython3, Status.Done);
  });
}

class InitProps {
  version: string = "";
  packages: string[] = [];
}

function init(event: IpcMainEvent, props: InitProps) {
  console.log("init", props);
  const versionFile = path.join(dRoot, Configs.ConfigFile);
  if (fs.existsSync(versionFile)) {
    try {
      const data = fs.readFileSync(versionFile, "utf-8");
      const local: Config = JSON.parse(data.toString());
      if (local.version === props.version) {
        console.log("your version is the latest:", local.version);
        reply(event, channelName, Commands.Init, Status.Done, local);
        return;
      }
    } catch (err) {
      console.log("failed to load config file:", err);
    }
  }

  // p1, create virtual python environment
  const venv = path.join(dRoot, Paths.PyEnv);
  const p1 = spawn("python3", ["-m", "venv", venv]);
  p1.on("error", () => {
    console.log("error2");
    reply(event, channelName, Commands.Init, Status.Error);
  });
  p1.on("exit", () => {
    let hasError = false;
    console.log(">> pip install -I", props.packages.join(" "));

    // create directory for storing resources
    fs.mkdirSync(path.join(dRoot, Paths.Res), { recursive: true });

    // p2, install dependencies to virtual environment
    // -I stands for --ignore-installed which will ignore the installed packages, overwriting them.
    const p2 = spawn(path.join(venv, "bin", "pip"), [
      "install",
      "-I",
      ...props.packages,
    ]);
    p2.stdout.on("data", (data) => {
      const dt = ("" + data).trim();
      console.log("stdout:", dt);
      reply(event, channelName, Commands.Init, Status.Info, dt);
    });
    p2.stderr.on("data", (data) => {
      // stderr: ERROR: Invalid requirement: 'easyocr PyAutoGUI==0.9.53'
      // stderr: WARNING: You are using pip version 21.2.4; however, version 22.3.1 is available.
      // You should consider upgrading via the 'python -m pip install --upgrade pip' command.
      const dt = ("" + data).trim();
      console.log("stderr:", dt);
      hasError = hasError || dt.startsWith("ERROR:");
      reply(event, channelName, Commands.Init, Status.Error, dt);
      p2.kill();
    });
    p2.on("error", () => {
      console.log("error3");
      reply(event, channelName, Commands.Init, Status.Error);
    });
    p2.on("exit", () => {
      console.log(">> write config.json");

      if (!hasError) {
        // write config file to dRoot, this file can identify success
        fs.writeFileSync(versionFile, JSON.stringify(props), "utf-8");
        reply(event, channelName, Commands.Init, Status.Done);
      }
    });
  });
}

function remove(event: IpcMainEvent) {
  console.log("remove");
  try {
    fs.rmdirSync(dRoot);
  } catch (err) {
    console.log("failed to remove", dRoot);
    reply(event, channelName, Commands.Remove, Status.Error);
    return;
  }
  reply(event, channelName, Commands.Remove, Status.Done);
}

class RunProps {
  filename: string = ""; // local file system
  checksum: string = "";
  args: string[] | undefined;
}

function killGlobalRunner() {
  if (global.runner) {
    global.runner.kill();
    global.runner = null;
  }
}

const crypto = require("crypto");
function getChecksum(path: string) {
  return new Promise((resolve, reject) => {
    // if absolutely necessary, use md5
    const hash = crypto.createHash("sha256");
    const input = fs.createReadStream(path);
    input.on("error", reject);
    input.on("data", (chunk) => {
      hash.update(chunk);
    });
    input.on("close", () => {
      resolve(hash.digest("hex"));
    });
  });
}

function run(cmd: Commands, event: IpcMainEvent, props: RunProps) {
  const fullpath = path.join(dRoot, props.filename);
  if (!fs.existsSync(fullpath)) {
    // just make it simple enough
    reply(event, channelName, cmd, Status.Error, "not exists");
    return;
  }

  getChecksum(fullpath)
    .then((checksum) => {
      if (checksum !== props.checksum) {
        // just make it simple enough
        reply(event, channelName, cmd, Status.Error, "checksum error");
        return;
      }
      doRun(cmd, event, props);
    })
    .catch((rejected) => {
      console.log("checksum rejected:", rejected);
      reply(event, channelName, cmd, Status.Error, "checksum error");
    });
}

function doRun(cmd: Commands, event: IpcMainEvent, props: RunProps) {
  if (cmd === Commands.RunPysh) {
    const options: Options = {
      mode: "text",
      pythonOptions: ["-u"], // get print results in real-time
      pythonPath: path.join(dRoot, Paths.PyEnv, "bin", "python"),
      scriptPath: dRoot,
      args: props.args,
    };
    global.runner = PythonShell.run(props.filename, options, (err) => {
      if (err) {
        console.log("run error", err);
      }
    });
  } else {
    global.runner = spawn(path.join(dRoot, props.filename), props.args);
  }
  const ps = global.runner;
  const messageCallback = (data: any) => {
    console.log("message", data);
    try {
      const j = JSON.parse(data);
      if (typeof j !== "object") {
        return;
      }
      reply(event, channelName, Commands.RunPysh, Status.Info, j);
    } catch {
      // ignore unprocessable messages
    }
  };
  if (cmd === Commands.RunPysh) {
    ps.on("message", messageCallback);
    // end the input stream and allow the process to exit
    (ps as PythonShell).end(function (err, code, signal) {
      if (err) {
        console.log("err: " + err.message);
        // reply(event, channelName, cmd, Status.Error, err);
      } else {
        console.log("The exit code was: " + code);
        console.log("The exit signal was: " + signal);
        reply(event, channelName, cmd, Status.Done);
      }
      global.runner = null;
    });
  } else {
    ps.stdout?.on("data", messageCallback);
    // ps.on("error", (err: Error) => {
    //   multiple times reach here
    // });
    ps.on("exit", () => {
      reply(event, channelName, cmd, Status.Done);
      killGlobalRunner();
    });
  }
}

function runPysh(event: IpcMainEvent, props: RunProps) {
  console.log("run", props);
  if (global.runner) {
    console.log("already has a running python-shell");
    return;
  }
  run(Commands.RunPysh, event, props);
}

function runBin(event: IpcMainEvent, props: RunProps) {
  console.log("runBin", props);
  if (global.runner) {
    console.log("already has a running binary");
    return;
  }
  run(Commands.RunBin, event, props);
}

function readConfig(event: IpcMainEvent) {
  console.log("readConfig");
  const versionFile = path.join(dRoot, Configs.ConfigFile);
  if (!fs.existsSync(versionFile)) {
    reply(event, channelName, Commands.ReadConfig, Status.Done);
    return;
  }

  try {
    const data = fs.readFileSync(versionFile, "utf-8");
    const local: Config = JSON.parse(data.toString());
    reply(event, channelName, Commands.ReadConfig, Status.Done, local);
  } catch (err) {
    console.log("failed to load version file");
    reply(event, channelName, Commands.ReadConfig, Status.Error);
  }
}

function writeConfig(event: IpcMainEvent) {
  console.log("writeConfig");
  // TODO implement
  reply(event, channelName, Commands.WriteConfig, Status.Error);
}

class DownloadProps {
  url: string = "";
  checksum: string = "";
  type: string = "code"; // code | resource
}

function download(event: IpcMainEvent, props: DownloadProps) {
  console.log("download", props);
  const url = new URL(props.url);
  const pnames = url.pathname.split("/");
  if (pnames.length < 1) {
    const data = "illegal pathname:" + url.pathname;
    reply(event, channelName, Commands.Download, Status.Error, data);
    return;
  }

  const filepath = path.join(dRoot, pnames[pnames.length - 1]);
  const file = fs.createWriteStream(filepath);
  const request = url.protocol === "http:" ? http.get(url) : https.get(url);
  request.on("response", (resp: http.IncomingMessage) => {
    resp.pipe(file);
    file.on("finish", () => {
      console.log("download finish");
      file.close();
      reply(event, channelName, Commands.Download, Status.Done);
    });
  });
  request.on("error", () => {
    console.log("download error");
    file.close();
    reply(event, channelName, Commands.Download, Status.Error);
  });
}
