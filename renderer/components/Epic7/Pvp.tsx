import { forwardRef, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Select,
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

const ventureData = [
  {
    image: "leif.png",
    label: "使用叶子",
    value: "leif",
    description: "自动使用叶子补充行动力",
  },
  {
    image: "diamond.png",
    label: "使用钻石",
    value: "diamond",
    description: "自动使用钻石补充行动力,如果同时选择了叶子,则叶子优先",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

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

interface PvpProps {}

export const Pvp = (props: PvpProps) => {
  const runningRef = useRef<boolean>(false);
  const [running, setRunning] = useState(false);
  const [ventureOptions, setVentureOptions] = useState(["leif"]);
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

  const missions = [
    { value: "current", label: "当前关卡" },
    { value: "ep1-9-4", label: "第一章 9-4" },
    { value: "ep1-9-7", label: "第一章 9-7" },
  ];

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
        <Card radius={10} shadow="xl" mt="xs" withBorder>
          <Group noWrap align="flex-start">
            待施工
          </Group>
        </Card>
      </Group>
    </>
  );
};
