import { useEffect, useState } from "react";
import {
  Card,
  Group,
  Loader,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconCamera } from "@tabler/icons";
import { CHECKSUM_GAME, Commands, GAME_SCRIPT, PYTRON_CHANNEL } from "../utils";

class Response {
  command: string;
  time: Date;
  result: string;
  data: Object;
}

interface DeveloperProps {}

const Developer = (props: DeveloperProps) => {
  const [running, setRunning] = useState(false);

  const handleMessage = (_event, resp: Response) => {
    console.log("handleMessage venture", resp);
    if (!running) {
      return;
    }

    console.log(resp.result, resp.data);

    if (resp.result === "done") {
      setRunning(false);
    }
  };

  useEffect(() => {
    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(PYTRON_CHANNEL, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(PYTRON_CHANNEL, handleMessage);
    };
  }, [running]);

  const handleScreenshot = () => {
    if (running) {
      global.ipcRenderer.send(PYTRON_CHANNEL, Commands.Stop);
      return;
    }
    setRunning(true);
    global.ipcRenderer.send(PYTRON_CHANNEL, Commands.RunPysh, {
      filename: GAME_SCRIPT,
      checksum: CHECKSUM_GAME,
      args: ["gameshot", JSON.stringify({})],
    });
  };

  return (
    <>
      <Group mb={50} noWrap align="flex-start">
        <Card radius={10} shadow="xl" sx={{ width: "100%" }} mt="xs" withBorder>
          <Stack sx={{ width: "100%" }}>
            <UnstyledButton
              bg="#eee"
              onClick={handleScreenshot}
              sx={{ border: "1px solid #bbb", borderRadius: "8px" }}
              p={4}
            >
              <Group position="center">
                {running ? (
                  <>
                    <Loader size={18} />
                    <Text color="red">进行中</Text>
                  </>
                ) : (
                  <>
                    <IconCamera color="#0b0" size={18} />
                    <Text color="green">游戏截图</Text>
                  </>
                )}
              </Group>
            </UnstyledButton>
          </Stack>
        </Card>
      </Group>
    </>
  );
};

export default Developer;
