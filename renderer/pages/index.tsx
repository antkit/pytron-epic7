import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Container, Group, NumberInput, Stack, Tabs, Text, UnstyledButton } from "@mantine/core";
import { SecretShop, Venture } from "../components/Epic7";
import { Icon123, IconBorderAll, IconMessage, IconRecycle, IconScale } from "@tabler/icons";
import { Test } from "../components/Epic7/Test";

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

enum Results {
  Success = "success",
  Failed = "failed",
}
const channelName = "pytron";

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to 'message' channel
    global.ipcRenderer.addListener("message", handleMessage);

    return () => {
      global.ipcRenderer.removeListener("message", handleMessage);
    };
  }, []);

  // const onSayHiClick = () => {
  //   global.ipcRenderer.send("message", "hi from next");
  // };

  return (
    <Layout title="第七史诗助手">
      {/* <h1>Hello Next.js 👋</h1>
      <button onClick={onSayHiClick}>Say hi to electron</button>
      <p>
        <Link href="/about">About</Link>
      </p> */}
      {/* <Container size="xs"> */}
        <Tabs defaultValue="secretShop">
          <Tabs.List>
            <Tabs.Tab icon={<IconScale color="#7bc62d" size={20} />} value="secretShop">
              秘密商店
            </Tabs.Tab>
            <Tabs.Tab icon={<IconBorderAll color="#7bc62d" size={20} />} value="venture">
              冒险迷宫
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="secretShop" p="xs">
            <SecretShop buyList={["covenant_bookmark", "mystic_medal"]} />
          </Tabs.Panel>
          <Tabs.Panel value="venture" p="xs">
            <Venture buyList={["covenant_bookmark", "mystic_medal"]} />
          </Tabs.Panel>
        </Tabs>
      {/* </Container> */}

      <Container size="xl">
        <Test />
      </Container>
    </Layout>
  );
};

export default IndexPage;
