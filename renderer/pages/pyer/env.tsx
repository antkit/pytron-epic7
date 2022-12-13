import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Container,
  Group,
  NumberInput,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconRecycle,
} from "@tabler/icons";

enum Commands {
  DetectPython3 = "detectPython3", // 检测系统Python环境
  Init = "init", // 初始化pytron环境
  Remove = "remove", // 移除pytron环境
  // Run = "run", // python-shell执行venv下的python
  ReadConfig = "readConfig", // 读取配置文件
  WriteConfig = "writeConfig", // 写入配置文件
  Download = "download", // 下载资源、代码文件
  RunPysh = "runPysh", // python-shell执行venv下的python
  RunBin = "runBin",
}

enum Results {
  Success = "success",
  Failed = "failed",
}
const channelName = "pytron";

const EnvPage = () => {
  const [loopTimes, setLoopTimes] = useState(10)

  useEffect(() => {
    const handleMessage = (_event, args) => {
      console.log(args);
      // alert(args);
    };

    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(channelName, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(channelName, handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send(channelName, Commands.ReadConfig);
  };

  const handleDetectPython = () => {
    global.ipcRenderer.send(channelName, Commands.DetectPython3);
  };

  const handleInit = () => {
    global.ipcRenderer.send(channelName, Commands.Init, {version: "0.1.0", packages:["easyocr", "PyAutoGUI==0.9.53", "trio"]});
  };

  const handleRunPyshTest = () => {
    global.ipcRenderer.send(channelName, Commands.RunPysh, {filename: "game.py", md5: "", args: ["secretshop", "" + loopTimes]});
  };

  const handleRunBinTest = () => {
    global.ipcRenderer.send(channelName, Commands.RunBin, {filename: "run.bin", md5: ""});
  };

  const handleDownloadTest = () => {
    const props = {
      url: "http://localhost:18123/code/test.py",
      md5: "",
      type: "code",
    }
    global.ipcRenderer.send(channelName, Commands.Download, props);
  };

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      {/* <p>
        <Link href="/venture/maze">迷宫</Link>
        <Link href="/secretshop">秘密商店</Link>
      </p> */}

      <Container size="xl">
        <Stack mt={10}>
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
          <Group>
            <NumberInput defaultValue={loopTimes} onChange={setLoopTimes} />
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
          </Group>
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
        </Stack>
      </Container>
    </Layout>
  );
};

export default EnvPage;
