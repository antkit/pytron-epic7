import { useEffect } from "react";
import Layout from "../../components/Layout";
import {
  Container,
  Group,
  Stack,
  Tabs,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconBorderAll,
  IconGavel,
  IconRecycle,
  IconScale,
} from "@tabler/icons";

enum Commands {
  DetectPython3 = "detectPython3",
  Init = "init",
  Remove = "remove",
  Run = "run",
  ReadConfig = "readConfig",
  WriteConfig = "writeConfig",
  Download = "download",
}

enum Results {
  Success = "success",
  Failed = "failed",
}
const channelName = "pytron";

const UpdatePage = () => {
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
    global.ipcRenderer.send(channelName, Commands.Init, {version: "0.1.0", packages:["easyocr", "PyAutoGUI==0.9.53"]});
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
                <Text color="green">开始循环</Text>
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
        </Stack>
      </Container>
    </Layout>
  );
};

export default UpdatePage;
