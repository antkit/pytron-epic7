import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Tabs } from "@mantine/core";
import {
  EquipEvaluate,
  Gvg,
  Pvp,
  SecretShop,
  Venture,
} from "../components/Epic7";
import {
  IconAxe,
  IconBorderAll,
  IconLetterG,
  IconLetterP,
  IconScale,
} from "@tabler/icons";

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
      <Tabs defaultValue="secretshop">
        <Tabs.List>
          <Tabs.Tab
            icon={<IconScale color="#7bc62d" size={20} />}
            value="secretshop"
          >
            秘密商店
          </Tabs.Tab>
          <Tabs.Tab
            icon={<IconBorderAll color="#7bc62d" size={20} />}
            value="venture"
          >
            讨伐冒险
          </Tabs.Tab>
          <Tabs.Tab
            icon={<IconAxe color="#7bc62d" size={20} />}
            value="equipstat"
          >
            装备评分
          </Tabs.Tab>
          <Tabs.Tab
            icon={<IconLetterG color="#7bc62d" size={20} />}
            value="gvg"
          >
            公会战
          </Tabs.Tab>
          <Tabs.Tab
            icon={<IconLetterP color="#7bc62d" size={20} />}
            value="pvp"
          >
            竞技场
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="secretshop" p="xs">
          <SecretShop />
        </Tabs.Panel>
        <Tabs.Panel value="venture" p="xs">
          <Venture />
        </Tabs.Panel>
        <Tabs.Panel value="gvg" p="xs">
          <Gvg />
        </Tabs.Panel>
        <Tabs.Panel value="pvp" p="xs">
          <Pvp />
        </Tabs.Panel>
        <Tabs.Panel value="equipstat" p="xs">
          <EquipEvaluate />
        </Tabs.Panel>
      </Tabs>
      {/* </Container> */}

      {/* <Container size="xl">
        <Test />
      </Container> */}
    </Layout>
  );
};

export default IndexPage;
