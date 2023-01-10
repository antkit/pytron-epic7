import { forwardRef, useEffect, useState } from "react";
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
import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconRecycle,
} from "@tabler/icons";
import { CHECKSUM_GAME, Commands, GAME_SCRIPT, PYTRON_CHANNEL } from "../../utils";

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
  status: "cleared" | "failed" | "running" | "unknown";
}

class LoopRecord {
  startedAt: Date;
  loopTimes: number;
  loopedTimes: number;
  venture: VentureResult;
  elapsedTime: number;
}

interface VentureProps {}

export const Venture = (props: VentureProps) => {
  const [running, setRunning] = useState(false);
  const [ventureOptions, setVentureOptions] = useState(["leif"]);
  const [loopTimes, setLoopTimes] = useState(10);
  const [loopRecords, setLoopRecords] = useState<LoopRecord[]>([]);

  const handleMessage = (_event, resp: Response) => {
    console.log("handleMessage venture", resp);
    if (!running) {
      return;
    }

    console.log(resp.result, resp.data);
    const records = loopRecords;

    if (resp.result === "done") {
      const lastRecord = records[records.length - 1];
      if (lastRecord.venture.status === "running") {
        lastRecord.venture.status = "unknown";
      }
      lastRecord.elapsedTime =
        new Date().getTime() - lastRecord.startedAt.getTime();
      setLoopRecords([...records]);
      setRunning(false);
    } else if (resp.data["result"]) {
      const lastRecord = records[records.length - 1];
      lastRecord.venture.status = resp.data["result"];
      lastRecord.elapsedTime =
        new Date().getTime() - lastRecord.startedAt.getTime();
      setLoopRecords([...records]);
    } else if (resp.data["looping"]) {
      const newRecord: LoopRecord = {
        startedAt: new Date(),
        loopTimes: loopTimes,
        loopedTimes: 0,
        venture: { status: "running" },
        elapsedTime: 0,
      };
      setLoopRecords([...records, newRecord]);
    }
  };

  useEffect(() => {
    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(PYTRON_CHANNEL, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(PYTRON_CHANNEL, handleMessage);
    };
  }, [running, loopRecords]);

  const missions = [
    { value: "current", label: "当前关卡" },
    { value: "ep1-9-4", label: "第一章 9-4" },
    { value: "ep1-9-7", label: "第一章 9-7" },
  ];

  const handleStartLoop = () => {
    if (running) {
      global.ipcRenderer.send(PYTRON_CHANNEL, Commands.Stop);
      return;
    }
    setRunning(true);
    const data = {
      times: loopTimes,
      episode: 0,
      chapter: 0,
      mission: 0,
      useLeif: true,
      useDiamond: false,
    };
    global.ipcRenderer.send(PYTRON_CHANNEL, Commands.RunPysh, {
      filename: GAME_SCRIPT,
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

  const fomratVentureResult = (st: string) => {
    const size = 14;
    if (st === "cleared") {
      return <IconCircleCheck color="green" size={size} />;
    }
    if (st === "failed") {
      return <IconCircleX color="red" size={size} />;
    }
    if (st === "running") {
      return <Loader color="blue" size={size} />;
    }
    return <IconCircleDashed color="blue" size={size} />;
  };

  const recordRows = loopRecords.map((e: LoopRecord, index: number) => (
    <tr key={index}>
      <td>
        {e.loopedTimes + 1}/{e.loopTimes}
      </td>
      <td>
        {e.startedAt.toLocaleString("zh-CN", {
          dateStyle: "short",
          timeStyle: "short",
          hour12: false,
        })}
      </td>
      <td>{formatElaspedTime(e.elapsedTime)}</td>
      <td>{fomratVentureResult(e.venture.status)}</td>
    </tr>
  ));

  return (
    <>
      <Group mb={50} noWrap align="flex-start">
        <Card radius={10} shadow="xl" mt="xs" withBorder>
          <Group noWrap align="flex-start">
            <Stack sx={{ width: 600 }}>
              <Select
                label="选择关卡:"
                defaultValue="current"
                data={missions}
              />
              <MultiSelect
                value={ventureOptions}
                onChange={setVentureOptions}
                label="冒险选项:"
                placeholder="定义冒险行为"
                itemComponent={SelectItem}
                data={ventureData}
                nothingFound="无"
                maxDropdownHeight={400}
              />
              <NumberInput
                label="循环次数:"
                min={0}
                step={10}
                value={loopTimes}
                onChange={setLoopTimes}
              />
            </Stack>
          </Group>
        </Card>
        <Card radius={10} shadow="xl" sx={{ width: "100%" }} mt="xs" withBorder>
          <Stack sx={{ width: "100%" }}>
            <UnstyledButton
              bg="#eee"
              onClick={handleStartLoop}
              sx={{ border: "1px solid #bbb", borderRadius: "8px" }}
              p={4}
            >
              <Group position="center">
                {running ? (
                  <>
                    <Loader size={18} />
                    <Text color="red">停止循环</Text>
                  </>
                ) : (
                  <>
                    <IconRecycle color="#0b0" size={18} />
                    <Text color="green">开始循环</Text>
                  </>
                )}
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
