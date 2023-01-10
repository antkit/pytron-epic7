import { forwardRef, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconRecycle } from "@tabler/icons";
import { CHECKSUM_GAME, PYTRON_CHANNEL, Commands, GAME_SCRIPT } from "../../utils";

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
    image: "hero_2x.png",
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

class Response {
  command: string;
  time: Date;
  result: string;
  data: Object;
}

class BoughtGoods {
  goods: string;
  count: number;
}

class LoopRecord {
  startedAt: Date;
  loopTimes: number;
  loopedTimes: number;
  boughtGoods: BoughtGoods[];
  elapsedTime: number;
}

interface SecretShopProps {}

export const SecretShop = (props: SecretShopProps) => {
  const [loopTimes, setLoopTimes] = useState(10);
  const [running, setRunning] = useState(false);
  const [remainDiamonds, setRemainDiamonds] = useState(0);
  const [remainGolds, setRemainGolds] = useState(0);
  const [buyList, setBuyList] = useState(["covenant_bookmark", "mystic_medal"]);
  const [breakList, setBreakList] = useState(["equip_epic_lv85"]);
  const [loopRecords, setLoopRecords] = useState<LoopRecord[]>([]);

  const handleMessage = (_event, resp: Response) => {
    console.log("handleMessage secretshop", "running:", running, resp);
    if (!running) {
      return;
    }

    console.log(resp.result, resp.data);
    const records = loopRecords;

    if (resp.result === "done") {
      const lastRecord = records[records.length - 1];
      lastRecord.elapsedTime =
        new Date().getTime() - lastRecord.startedAt.getTime();
      setLoopRecords([...records]);
      setRunning(false);
    } else if (resp.data["bought"]) {
      const goods = resp.data["bought"];
      const lastRecord = records[records.length - 1];
      let exists = false;
      for (let i = 0; i < lastRecord.boughtGoods.length; i++) {
        if (lastRecord.boughtGoods[i].goods === goods) {
          lastRecord.boughtGoods[i].count += 1;
          exists = true;
          break;
        }
      }
      if (!exists) {
        lastRecord.boughtGoods.push({ goods, count: 1 });
      }

      switch (resp.data["bought"]) {
        case "covenant_bookmark":
          console.log("购买 圣约书签");
          break;
        case "mystic_medal":
          console.log("购买 神秘奖牌");
          break;
      }
    } else if (resp.data["looping"]) {
      const lastRecord = records[records.length - 1];
      lastRecord.loopedTimes += 1;
      lastRecord.elapsedTime =
        new Date().getTime() - lastRecord.startedAt.getTime();
      setLoopRecords([...records]);
    }
  };

  // See https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2895
  useEffect(() => {
    // add a listener to channel
    global.ipcRenderer.addListener(PYTRON_CHANNEL, handleMessage);

    return () => {
      global.ipcRenderer.removeListener(PYTRON_CHANNEL, handleMessage);
    };
  }, [running, loopRecords]);

  const handleStartLoop = () => {
    if (running) {
      global.ipcRenderer.send(PYTRON_CHANNEL, Commands.Stop);
      return;
    }
    setRunning(true);
    const data = {
      times: loopTimes,
      buyList,
      breakList,
      remainDiamonds,
      remainGolds,
    };
    global.ipcRenderer.send(PYTRON_CHANNEL, Commands.RunPysh, {
      filename: GAME_SCRIPT,
      checksum: CHECKSUM_GAME,
      args: ["secretshop", JSON.stringify(data)],
    });

    const newRecord: LoopRecord = {
      startedAt: new Date(),
      loopTimes: loopTimes,
      loopedTimes: 0,
      boughtGoods: [],
      elapsedTime: 0,
    };
    setLoopRecords([...loopRecords, newRecord]);
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

  const goodsLogo = (id: string) => {
    for (let i = 0; i < buyListData.length; i++) {
      if (buyListData[i].value === id) {
        return buyListData[i].image;
      }
    }
    return "ma_unknown.png";
  };

  const fomratBoughtGoods = (bought: BoughtGoods[]) => {
    // TODO key
    const goods = bought.map((g: BoughtGoods, index: number) => (
      <Group key={index} spacing={5} pt={3}>
        <Avatar size={20} src={goodsLogo(g.goods)} radius={26} />
        <Text>x {g.count}</Text>
      </Group>
    ));
    return goods;
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
      <td>{fomratBoughtGoods(e.boughtGoods)}</td>
    </tr>
  ));

  return (
    <>
      <Group mb={50} noWrap align="flex-start">
        <Card radius={10} shadow="xl" mt="xs" withBorder>
          <Group noWrap align="flex-start">
            <Stack sx={{ width: 600 }}>
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
                  <td>开始时间</td>
                  {/* <td>循环次数</td> */}
                  <td>刷新次数</td>
                  <td>用时</td>
                  <td>购买商品</td>
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
