import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  List,
  Loader,
  MultiSelect,
  NumberInput,
  ScrollArea,
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
  IconPlayerPlay,
} from "@tabler/icons";
import {
  CHECKSUM_GAME,
  Commands,
  GAME_SCRIPT,
  PYTRON_CHANNEL,
} from "../../utils";

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
  const [stage, setStage] = useState("Current");
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
      const lastRecord = records[0]; //records.length - 1];
      if (lastRecord) {
        if (lastRecord.venture.status === "running") {
          lastRecord.venture.status = "unknown";
        }
        lastRecord.elapsedTime =
          new Date().getTime() - lastRecord.startedAt.getTime();
      }
      setLoopRecords([...records]);
      setRunning(false);
    } else if (resp.data["result"]) {
      const lastRecord = records[0]; //records.length - 1];
      lastRecord.venture.status = resp.data["result"];
      lastRecord.elapsedTime =
        new Date().getTime() - lastRecord.startedAt.getTime();
      setLoopRecords([...records]);
    } else if (resp.data["looping"]) {
      const newRecord: LoopRecord = {
        startedAt: new Date(),
        loopTimes: loopTimes,
        loopedTimes: +resp.data["looping"],
        venture: { status: "running" },
        elapsedTime: 0,
      };
      setLoopRecords([newRecord, ...records]); // 倒叙
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
    { value: "Current", label: "当前关卡" },
    { value: "EP1 2S 3-1", label: "第一章 3-1" },
    { value: "EP1 9-2 9-7", label: "第一章 9-7" },
    // { value: "EP4 1 1-5",   label: "第四章 1-5" },
    { value: "EP4 10 10-7", label: "第四章 10-7" },
  ];

  const handleStartLoop = () => {
    if (running) {
      global.ipcRenderer.send(PYTRON_CHANNEL, Commands.Stop);
      return;
    }
    setRunning(true);
    const stageItems = stage.split(" ");
    console.log('stage:', stage, ', items:', stageItems);
    const data = {
      times: loopTimes,
      episode: stage === "Current" ? 0 : stageItems[0],
      chapter: stage === "Current" ? 0 : stageItems[1],
      mission: stage === "Current" ? 0 : stageItems[2],
      useLeif: true,
      useDiamond: false,
    };
    console.log(data);
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
        {e.loopedTimes}/{e.loopTimes}
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
                value={stage}
                onChange={setStage}
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
              <Text pb={0} mb={-13} sx={{fontSize: 14, fontWeight: 700}}>如何选择关卡：</Text>
              <List pl={10} sx={{fontSize: 12}}>
                <List.Item>当前关卡，要求非迷宫地图，适合讨伐、支线活动等</List.Item>
                <List.Item>第一章 3-1，2体3战，主刷好感度，伴有狗粮产出</List.Item>
                <List.Item>第一章 9-7，10体11战2箱子，主刷狗粮，伴有强化石、低级装备</List.Item>
                <List.Item>第四章 10-7，10体8战1箱子，企鹅、红叶、狗粮等综合性价比高；难度高，战斗耗时长</List.Item>
              </List>
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
                    <IconPlayerPlay color="#0b0" size={18} />
                    <Text color="green">开始循环</Text>
                  </>
                )}
              </Group>
            </UnstyledButton>
            <ScrollArea sx={{ height: 400 }}>
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
            </ScrollArea>
          </Stack>
        </Card>
      </Group>
    </>
  );
};
