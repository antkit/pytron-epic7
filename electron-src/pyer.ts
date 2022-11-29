import * as path from "path";
import fs from "fs";
import { spawn, ChildProcess } from "child_process";
import { app } from "electron";
import { Options, PythonShell } from "python-shell";

const PYENV = "pyenv";
const PYSRC = "pysrc";
const dRoot = path.join(app.getPath("home"), ".pytron");

export class UpdateProps {
  version: string = "";
  packages: string[] = []; // packages item supports both PyAutoGUI and PyAutoGUI==0.9.53
}

export function updateEnvironment(props: UpdateProps) {
  const versionFile = path.join(dRoot, "version");
  const st: fs.Stats = fs.statSync(versionFile);
  if (st) {
    try {
      const data = fs.readFileSync(versionFile, "utf-8");
      const local: UpdateProps = JSON.parse(data.toString());
      if (local.version === props.version) {
        console.log("your version is the latest:", local.version);
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
    const venv = path.join(dRoot, PYENV);
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

let running = false;

export function runCommand(props: RunProps) {
  if (running) {
    console.log("already has a running python-shell");
    return;
  }

  running = true;
  const filepath = path.join(dRoot, PYSRC, props.filepath);
  const options: Options = {
    mode: "text",
    pythonPath: path.join(dRoot, PYENV, "bin", "python"),
  };
  const py = PythonShell.run(filepath, options, (err) => {
    console.error(err);
  });
  py.on("message", (m: string) => {
    console.log("message", m);
    try {
      const j = JSON.parse(m);
      console.log("json:", j);
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
