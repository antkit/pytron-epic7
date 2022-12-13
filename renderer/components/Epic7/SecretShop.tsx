import { Checkbox, NumberInput, Radio, Text } from "@mantine/core";

interface SecretShopProps {
  buyList: string[];
}

export const SecretShop = (props: SecretShopProps) => {
  return (<>
    <Checkbox.Group label="购买以下商品:" value={props.buyList}>
      <Checkbox value="covenant_bookmark" label="圣约书签" />
      <Checkbox value="mystic_medal" label="神秘奖牌" />
      <Checkbox value="hero_star_2x" label="2星狗粮" />
    </Checkbox.Group>
    <Radio.Group label="出现85级红装时:" value="break">
      <Radio value="break" label="停止" />
      <Radio value="buy" label="购买" />
      <Radio value="skip" label="忽略" />
    </Radio.Group>
    <NumberInput label="保留金币:" rightSection={<Text color="gray">万</Text>} />
    <NumberInput label="保留钻石:" />
  </>)
};
