import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  MultiSelect,
  NumberInput,
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

const buyListData = [
  {
    image: "covenant_bookmark.png",
    label: "圣约书签",
    value: "covenant_bookmark",
    description: "圣约书签x5, 售价18.4万金币",
  },
  {
    image: "mystic_medal.png",
    label: "神秘奖牌",
    value: "mystic_medal",
    description: "神秘奖牌x50, 售价28万金币",
  },
  {
    image: "ma_unknown.png",
    label: "2星狗粮",
    value: "hero_star_2x",
    description: "随机2星英雄, 售价2.8万金币",
  },
];

const breakListData = [
  {
    image: "ma_unknown.png",
    label: "85级红装",
    value: "equip_epic_lv85",
    description: "随机85级史诗装备, 售价140万金币",
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

interface SecretShopProps {}

export const SecretShop = (props: SecretShopProps) => {
  const [loopTimes, setLoopTimes] = useState(10);
  const [remainDiamonds, setRemainDiamonds] = useState(0);
  const [remainGolds, setRemainGolds] = useState(0);
  const [buyList, setBuyList] = useState(["covenant_bookmark", "mystic_medal"]);
  const [breakList, setBreakList] = useState(["equip_epic_lv85"]);

  useEffect(() => {
    const handleMessage = (_event, args) => {
      console.log(args);
    };

    // add a listener to CHANNEL channel
    global.ipcRenderer.addListener(channelName, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(channelName, handleMessage);
    };
  }, []);

  const handleStartLoop = () => {
    global.ipcRenderer.send(channelName, Commands.RunPysh, {
      filename: "game.py",
      md5: "",
      args: ["secretshop", "" + loopTimes],
    });
  };

  return (
    <Card radius={10} shadow="xl">
      <Group noWrap>
        <Stack sx={{ width: "100%" }}>
          <MultiSelect
            value={buyList}
            onChange={setBuyList}
            label="刷出时自动购买:"
            placeholder="选择你想购买的商品"
            itemComponent={SelectItem}
            data={buyListData}
            nothingFound="无"
            maxDropdownHeight={400}
          />
          <MultiSelect
            value={breakList}
            onChange={setBreakList}
            label="刷出时停止循环:"
            placeholder="选择你关注但不自动购买的商品"
            itemComponent={SelectItem}
            data={breakListData}
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
          <NumberInput
            label="保留金币:"
            min={0}
            value={remainGolds}
            onChange={setRemainGolds}
            rightSection={<Text color="gray">万</Text>}
          />
          <NumberInput
            min={0}
            value={remainDiamonds}
            onChange={setRemainDiamonds}
            label="保留钻石:"
          />
        </Stack>
        <Stack sx={{ width: 300 }}>
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
        </Stack>
      </Group>
    </Card>
  );
};
