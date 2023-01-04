import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconRecycle } from "@tabler/icons";
import { CHECKSUM_GAME } from "../../utils";

const channelName = "pytron";

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

class Response {
  command: string;
  time: Date;
  result: string;
  data: Object;
}

class VentureResult {
  succeed: boolean;
}

class LoopRecord {
  startedAt: Date;
  loopTimes: number;
  loopedTimes: number;
  venture: VentureResult;
  elapsedTime: number;
}

interface EquipStatProps {}

export const EquipStat = (props: EquipStatProps) => {
  const runningRef = useRef<boolean>(false);
  const [running, setRunning] = useState(false);
  const [loopTimes, setLoopTimes] = useState(10);
  const [loopRecords, setLoopRecords] = useState<LoopRecord[]>([]);
  const recordsRef = useRef<LoopRecord[]>([]);

  useEffect(() => {
    const handleMessage = (_event, resp: Response) => {
      if (!running) {
        return;
      }

      console.log(resp.result, resp.data);
      const records = recordsRef.current;

      if (resp.result === "done") {
        const lastRecord = records[records.length - 1];
        lastRecord.elapsedTime =
          new Date().getTime() - lastRecord.startedAt.getTime();
        setLoopRecords([...recordsRef.current]);
        runningRef.current = false;
        setRunning(runningRef.current);
      } else if (resp.data["looping"]) {
        const lastRecord = records[records.length - 1];
        lastRecord.loopedTimes += 1;
        lastRecord.elapsedTime =
          new Date().getTime() - lastRecord.startedAt.getTime();
        setLoopRecords([...recordsRef.current]);
      }
    };

    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(channelName, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(channelName, handleMessage);
    };
  }, []);

  const handleStartLoop = () => {
    if (running) {
      return;
    }
    runningRef.current = true;
    setRunning(runningRef.current);
    const data = {
      times: loopTimes,
      episode: 0,
      chapter: 0,
      mission: 0,
      useLeif: true,
      useDiamond: false,
    };
    global.ipcRenderer.send(channelName, Commands.RunPysh, {
      filename: "game.py",
      checksum: CHECKSUM_GAME,
      args: ["venture", JSON.stringify(data)],
    });
  };

  const formatElaspedTime = (t: number) => {
    const unitFormat = (u: number) => (u < 10 ? "0" + u : "" + u);
    const hours = Math.floor(t / 1000 / 3600);
    const minutes = Math.floor(t / 1000 / 60) % 60;
    const seconds = Math.floor(t / 1000) % 60;
    return (
      unitFormat(hours) + ":" + unitFormat(minutes) + ":" + unitFormat(seconds)
    );
  };

  const recordRows = loopRecords.map((e: LoopRecord, index: number) => (
    <tr key={index}>
      <td>
        {e.startedAt.toLocaleString("zh-CN", {
          dateStyle: "short",
          timeStyle: "short",
          hour12: false,
        })}
      </td>
      <td>
        {e.loopedTimes}/{e.loopTimes}
      </td>
      <td>{formatElaspedTime(e.elapsedTime)}</td>
      <td></td>
    </tr>
  ));

  return (
    <>
      <Group mb={50} noWrap align="flex-start">
        <Card radius={10} shadow="xl">
          <Group noWrap align="flex-start">
            <Stack sx={{ width: 600 }}>
              <ul>
                <li>速度: 2分/点</li>
                <li>暴击: 1.5分/点</li>
                <li>爆伤: 1.1分/点</li>
                <li>其他: 1分/点</li>
              </ul>
            </Stack>
          </Group>
        </Card>
        <Card radius={10} shadow="xl" sx={{ width: "100%" }}>
          <Stack sx={{ width: "100%" }}>
            <UnstyledButton
              bg="#eee"
              onClick={handleStartLoop}
              sx={{ border: "1px solid #bbb", borderRadius: "8px" }}
              p={4}
            >
              <Group position="center">
                {running ? (
                  <Loader size={18} />
                ) : (
                  <IconRecycle color="#0b0" size={18} />
                )}
                <Text color="green">开始评估</Text>
              </Group>
            </UnstyledButton>
            <Table fontSize="xs">
              <thead style={{ fontSize: 13, fontWeight: 500 }}>
                <tr>
                  <td>战斗序号</td>
                  <td>开始时间</td>
                  <td>战斗耗时</td>
                  <td>战斗结果</td>
                </tr>
              </thead>
              <tbody>{recordRows}</tbody>
            </Table>
          </Stack>
        </Card>
      </Group>
    </>
  );
};
