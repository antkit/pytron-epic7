import { Checkbox, NumberInput, Radio, Text } from "@mantine/core";

interface VentureProps {
  buyList: string[];
}

export const Venture = (props: VentureProps) => {
  return (<>
    <NumberInput label="保留金币:" rightSection={<Text color="gray">万</Text>} />
    <NumberInput label="保留钻石:" />
  </>)
};
