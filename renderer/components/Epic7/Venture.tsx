import { forwardRef, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconRecycle } from "@tabler/icons";

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

interface VentureProps {}

export const Venture = (props: VentureProps) => {
  const [ventureOptions, setVentureOptions] = useState(["leif"]);
  const [loopTimes, setLoopTimes] = useState(10);

  const missions = [
    { value: "current", label: "当前关卡" },
    { value: "ep1-9-4", label: "第一章 9-4" },
    { value: "ep1-9-7", label: "第一章 9-7" },
  ];

  const handleStartLoop = () => {
    global.ipcRenderer.send(channelName, Commands.RunPysh, {
      filename: "game.py",
      md5: "",
      args: ["secretshop", "" + loopTimes],
    });
  };

  return (
    <>
      <Card radius={10} shadow="xl">
          <UnstyledButton
            bg="#eee"
            onClick={handleStartLoop}
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
      </Card>
      <Stack>
        <Select label="选择关卡:" defaultValue="current" data={missions} />
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
    </>
  );
};
