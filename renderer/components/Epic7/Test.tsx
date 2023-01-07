import { useEffect, useState } from "react";
import {
  Group,
  NumberInput,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconRecycle } from "@tabler/icons";

enum Commands {
  DetectPython3 = "detectPython3", // 检测系统Python环境
  Init = "init", // 初始化pytron环境
  Remove = "remove", // 移除pytron环境
  ReadConfig = "readConfig", // 读取配置文件
  WriteConfig = "writeConfig", // 写入配置文件
  Download = "download", // 下载资源、代码文件
  RunPysh = "runPysh", // python-shell运行python代码
  RunBin = "runBin", // 运行可执行文件
}

enum Results {
  Success = "success",
  Failed = "failed",
}
const channelName = "pytron";

export const Test = () => {
  const [loopTimes, setLoopTimes] = useState(10);

  // useEffect(() => {
  //   const handleMessage = (_event, args) => {
  //     console.log(args);
  //     // alert(args);
  //   };

  //   // add a listener to CHANNEL channel
  //   global.ipcRenderer.addListener(channelName, handleMessage);

  //   return () => {
  //     global.ipcRenderer.removeListener(channelName, handleMessage);
  //   };
  // }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send(channelName, Commands.ReadConfig);
  };

  const handleDetectPython = () => {
    global.ipcRenderer.send(channelName, Commands.DetectPython3);
  };

  const handleInit = () => {
    global.ipcRenderer.send(channelName, Commands.Init, {
      version: "0.1.0",
      packages: ["easyocr", "PyAutoGUI==0.9.53", "trio"],
    });
  };

  const handleRunPyshTest = () => {
    global.ipcRenderer.send(channelName, Commands.RunPysh, {
      filename: "game.py",
      md5: "",
      args: ["secretshop", "" + loopTimes],
    });
  };

  const handleRunBinTest = () => {
    global.ipcRenderer.send(channelName, Commands.RunBin, {
      filename: "run.bin",
      md5: "",
    });
  };

  const handleDownloadTest = () => {
    const props = {
      url: "http://localhost:18123/code/test.py",
      md5: "",
      type: "code",
    };
    global.ipcRenderer.send(channelName, Commands.Download, props);
  };

  return (
    <Stack mt={10}>
      <Group>
        <UnstyledButton
          onClick={handleDetectPython}
          bg="#eee"
          sx={{ border: "1px solid gray", borderRadius: "5px" }}
        >
          <Group position="center">
            <IconRecycle color="green" size={32} />
            <div>
              <Text color="green">检测Python</Text>
              <Text size="xs" color="green">
                bob@handsome.inc
              </Text>
            </div>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          onClick={handleInit}
          bg="#eee"
          sx={{ border: "1px solid gray", borderRadius: "5px" }}
        >
          <Group position="center">
            <IconRecycle color="green" size={32} />
            <div>
              <Text color="green">初始化</Text>
              <Text size="xs" color="green">
                bob@handsome.inc
              </Text>
            </div>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          onClick={handleDownloadTest}
          bg="#eee"
          sx={{ border: "1px solid gray", borderRadius: "5px" }}
        >
          <Group position="center">
            <IconRecycle color="green" size={32} />
            <div>
              <Text color="green">下载测试</Text>
              <Text size="xs" color="green">
                bob@handsome.inc
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Group>
      <Group>
        <NumberInput size="xs" defaultValue={loopTimes} onChange={setLoopTimes} />
        <UnstyledButton
          onClick={handleRunPyshTest}
          bg="#eee"
          sx={{ border: "1px solid gray", borderRadius: "5px" }}
        >
          <Group position="center">
            <IconRecycle color="green" size={32} />
            <div>
              <Text color="green">运行测试Pysh</Text>
              <Text size="xs" color="green">
                bob@handsome.inc
              </Text>
            </div>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          onClick={handleRunBinTest}
          bg="#eee"
          sx={{ border: "1px solid gray", borderRadius: "5px" }}
        >
          <Group position="center">
            <IconRecycle color="green" size={32} />
            <div>
              <Text color="green">运行测试Bin</Text>
              <Text size="xs" color="green">
                bob@handsome.inc
              </Text>
            </div>
          </Group>
        </UnstyledButton>
      </Group>
    </Stack>
  );
};
