import { useEffect } from "react";
import Layout from "../components/Layout";
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

const CHANNEL = "pyrun"

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event, args) => alert(args);

    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(CHANNEL, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(CHANNEL, handleMessage);
    };
  }, []);

  const onSayHiClick = () => {
    global.ipcRenderer.send(CHANNEL, "hi from next");
  };

  const handleStart = () => {

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
        <Tabs defaultValue="maze">
          <Tabs.List>
            <Tabs.Tab value="maze" icon={<IconBorderAll color="#7bc62d" size={20} />}>
              迷宫
            </Tabs.Tab>
            <Tabs.Tab value="secretshop" icon={<IconScale color="#7bc62d" size={20} />}>
              秘密商店
            </Tabs.Tab>
            <Tabs.Tab value="gavel" icon={<IconGavel color="#7bc62d" size={20} />}>
              打铁
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="maze" p="xs">
            冒险迷宫
          </Tabs.Panel>

          <Tabs.Panel value="secretshop" p="xs">
            秘密商店
          </Tabs.Panel>

          <Tabs.Panel value="gavel" p="xs">
            Settings tab content
          </Tabs.Panel>
        </Tabs>

        <Stack mt={10}>
          <UnstyledButton
            onClick={handleStart}
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
        </Stack>
      </Container>
    </Layout>
  );
};

export default IndexPage;
