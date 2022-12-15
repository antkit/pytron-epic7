import { Checkbox, NumberInput, Radio, Select, Text } from "@mantine/core";

interface VentureProps {
  buyList: string[];
}

export const Venture = (props: VentureProps) => {
  const missions = [
    { value: 'current', label: '当前关卡' },
    { value: 'ep1-9-4', label: '第一章 9-4' },
    { value: 'ep1-9-7', label: '第一章 9-7' },
  ]
  return (<>
    <Select label="选择关卡:" defaultValue="current" data={missions} />
  </>)
};
