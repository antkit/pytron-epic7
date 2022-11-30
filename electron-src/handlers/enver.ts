import * as path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { app, IpcMainEvent } from "electron";

import { Paths, Configs } from "../common";

const dRoot = path.join(app.getPath("home"), Paths.Root);

// let running = false;

enum Commands {
  // Version = "version",
  Load = "load",
  Update = "update",
}

enum Results {
  Success = "success",
  Failed = "failed",
}

class Config {
  version: string = "";
  packages: string[] = [];
}

// message: likes "easyocr,PyAutoGUI==0.9.53"
export function envHandler(event: IpcMainEvent, cmd: Commands, props?: Config) {
  console.log("-> env:", props);
  if (cmd === Commands.Load) {
    loadEnvironment(event);
  } else if (cmd === Commands.Update && props) {
    updateEnvironment(event, props);
  } else {
    console.log("command or props error", cmd, props);
  }
}

// Send message to event's sender
function reply(
  event: IpcMainEvent,
  channel: string,
  command: Commands,
  result: Results,
  data: any
) {
  const message = {
    command,
    time: new Date(),
    result,
    data,
  };
  event.sender.send(channel, message);
}

function loadEnvironment(event: IpcMainEvent) {
  console.log("getVersion");
  const versionFile = path.join(dRoot, "version");
  if (!fs.existsSync(versionFile)) {
    reply(event, Configs.ChannelEnv, Commands.Load, Results.Success, {
      version: "",
      packages: [],
    });
    return;
  }

  try {
    const data = fs.readFileSync(versionFile, "utf-8");
    const local: Config = JSON.parse(data.toString());
    reply(event, Configs.ChannelEnv, Commands.Load, Results.Success, local);
  } catch (err) {
    console.log("failed to load version file");
    reply(event, Configs.ChannelEnv, Commands.Load, Results.Failed, {
      version: "",
      packages: [],
    });
  }
}

function updateEnvironment(event: IpcMainEvent, props: Config) {
  const versionFile = path.join(dRoot, "version");
  if (fs.existsSync(versionFile)) {
    try {
      const data = fs.readFileSync(versionFile, "utf-8");
      const local: Config = JSON.parse(data.toString());
      if (local.version === props.version) {
        console.log("your version is the latest:", local.version);
        reply(event, Configs.ChannelEnv, Commands.Update, Results.Success, {
          result: "skip",
        });
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
    const venv = path.join(dRoot, Paths.PyEnv);
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
