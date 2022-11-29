import * as path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { app, IpcMainEvent } from "electron";
import { Options, PythonShell } from "python-shell";
import { URL } from "url";
import * as http from "http";
import * as https from "https";

const CHANNEL_UPDATE = "update";
const CHANNEL_RUN = "run";
const PYENV_NAME = "pyenv";
const PYSRC_NAME = "pysrc";
const dRoot = path.join(app.getPath("home"), ".pytron");

let running = false;

// Send message to event's sender
function reply(event: IpcMainEvent, channel: string, data: any) {
  const message = {
    time: new Date(),
    data: data,
  };
  event.sender.send(channel, message);
}

export class UpdateProps {
  version: string = "";
  packages: string[] = []; // packages item supports both PyAutoGUI and PyAutoGUI==0.9.53
}

export function updateEnvironment(event: IpcMainEvent, props: UpdateProps) {
  const versionFile = path.join(dRoot, "version");
  const st: fs.Stats = fs.statSync(versionFile);
  if (st) {
    try {
      const data = fs.readFileSync(versionFile, "utf-8");
      const local: UpdateProps = JSON.parse(data.toString());
      if (local.version === props.version) {
        console.log("your version is the latest:", local.version);
        reply(event, CHANNEL_UPDATE, { result: "skip" });
        return;
      }
    } catch (err) {
      console.log("failed to load version file:", err);
    }

    // file exists but was broken
    try {
      fs.rmSync(versionFile);
    } catch (err) {
      console.error("failed to remove version file:", err);
      return;
    }
  }

  // p1, check system python envrionment
  const p1: ChildProcess = spawn("python3", ["--version"]);
  p1.on("error", () => {
    console.log("error");
  }).on("exit", () => {
    console.log("exit");

    // p2, create virtual python environment
    const venv = path.join(dRoot, PYENV_NAME);
    const p2 = spawn("python3", ["-m", "venv", venv]);
    p2.on("error", () => {
      console.log("error2");
    }).on("exit", () => {
      console.log("exit2");

      // p3, install dependencies to virtual environment
      // -I stands for --ignore-installed which will ignore the installed packages, overwriting them.
      const p3 = spawn(path.join(venv, "bin", "pip"), [
        "install",
        "-I",
        props.packages.join(" "),
      ]);
      p3.on("error", () => {
        console.log("error3");
      }).on("exit", () => {
        console.log("exit3");

        // write version file to dRoot, this file can identify success
        fs.writeFileSync(versionFile, JSON.stringify(props), "utf-8");
      });
    });
  });
}

export class RunProps {
  filepath: string = "";
  md5: string = "";
}

function download(url: URL) {
  const pnames = url.pathname.split("/");
  const filepath = path.join(dRoot, PYSRC_NAME, pnames[pnames.length - 1]);
  const file = fs.createWriteStream(filepath);
  const request = url.protocol === "http" ? http.get(url) : https.get(url);
  request.on("response", (resp: http.IncomingMessage) => {
    resp.pipe(file);
  });
  request.on("error", () => {
    console.log("download error");
    file.close();
  });
  request.on("finish", () => {
    console.log("download finish");
    file.close();
  });
  return filepath;
}

export function pyRun(event: IpcMainEvent, props: RunProps) {
  if (running) {
    console.log("already has a running python-shell");
    return;
  }

  running = true;
  let filepath: string = "";
  try {
    const url = new URL(props.filepath);
    filepath = download(url);
  } catch (err: any) {
    console.log("download exception:", err);
    running = false;
    return;
  }

  // TODO waiting download finish
  console.log("continue pyrun", props);

  const options: Options = {
    mode: "text",
    pythonPath: path.join(dRoot, PYENV_NAME, "bin", "python"),
  };
  const py = PythonShell.run(filepath, options, (err) => {
    console.error(err);
  });
  py.on("message", (m: string) => {
    console.log("message", m);
    try {
      const j = JSON.parse(m);
      console.log("json:", j);
      reply(event, CHANNEL_RUN, j);
    } catch {
      // ignore unprocessable messages
    }
  });
  py.on("error", () => {
    running = false;
  });
  py.on("close", () => {
    running = false;
  });
}
