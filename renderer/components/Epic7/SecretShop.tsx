import { forwardRef, useState } from "react";
import {
  Avatar,
  Group,
  MultiSelect,
  NumberInput,
  Text,
} from "@mantine/core";

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
    description: "85级史诗装备, 售价140万金币",
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

interface SecretShopProps {
  buyList: string[];
}

export const SecretShop = (props: SecretShopProps) => {
  const [buyList, setBuyList] = useState(["covenant_bookmark", "mystic_medal"])
  const [breakList, setBreakList] = useState(["equip_epic_lv85"])
  return (
    <>
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
        label="保留金币:"
        rightSection={<Text color="gray">万</Text>}
      />
      <NumberInput label="保留钻石:" />
    </>
  );
};
