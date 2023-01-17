import {
  ActionIcon,
  Group,
  Image,
  NumberInput,
  Slider,
  Tooltip,
} from "@mantine/core";

type EquipAttributeProps = {
  tooltip: string;
  image: string;
  alt: string;
  min: number;
  max: number;
  percentage?: boolean;
  color: string;
  value: number;
  setValue(val: number): void;
};

export function EquipAttribute({
  tooltip,
  image,
  alt,
  min,
  max,
  percentage,
  color,
  value,
  setValue,
}: EquipAttributeProps) {
  return (
    <Group noWrap position="center" spacing="md">
      <Tooltip label={tooltip}>
        <ActionIcon>
          <Image
            src={image}
            alt={alt}
            width={30}
            onClick={() => setValue(min)}
          />
        </ActionIcon>
      </Tooltip>
      <Slider
        marks={[
          { value: min, label: percentage ? `${min}%` : min },
          { value: max, label: percentage ? `${max}%` : max },
        ]}
        color={color}
        value={value}
        size="xs"
        min={min}
        max={max}
        sx={{ width: "100%" }}
        onChange={(val) => setValue(val)}
      />
      <NumberInput
        styles={{ input: { width: 70 } }}
        size="xs"
        min={min}
        max={max}
        value={value}
        stepHoldDelay={500}
        stepHoldInterval={100}
        onChange={(val) => setValue(val || 0)}
      />
    </Group>
  );
}
