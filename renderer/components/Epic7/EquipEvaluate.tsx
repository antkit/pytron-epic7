import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons";
import {
  Center,
  SimpleGrid,
  Card,
  Divider,
  Group,
  Text,
  Button,
  Image,
} from "@mantine/core";
import { EquipAttribute } from "../EquipAttribute";
import { Rarity } from "../../utils/data";

export const EquipEvaluate = () => {
  const [atkPercent, setAtkPercent] = useState(0);
  const [atk, setAtk] = useState(0);
  const [defPercent, setDefPercent] = useState(0);
  const [def, setDef] = useState(0);
  const [hpPercent, setHpPercent] = useState(0);
  const [hp, setHp] = useState(0);
  const [crPercent, setCrPercent] = useState(0);
  const [cdPercent, setCdPercent] = useState(0);
  const [effPercent, setEffPercent] = useState(0);
  const [resPercent, setResPercent] = useState(0);
  const [spd, setSpd] = useState(0);
  const [totalScore, setTotalScore] = useState(0.0);
  const [atkScore, setAtkScore] = useState(0.0);
  const [defScore, setDefScore] = useState(0.0);
  const [assScore, setAssScore] = useState(0.0);
  const [attrsValid, setAttrsValid] = useState(true);

  const [equipLevel, setEquipLevel] = useState(90);
  const [equipRarity, setEquipRarity] = useState(Rarity.Epic);
  const [enhanceLevel, setEnhanceLevel] = useState(15);

  const [atkMax, setAtkMax] = useState(329);
  const [atkPercentMax, setAtkPercentMax] = useState(56);
  const [hpMax, setHpMax] = useState(1474);
  const [hpPercentMax, setHpPercentMax] = useState(56);
  const [defMax, setDefMax] = useState(238);
  const [defPercentMax, setDefPercentMax] = useState(56);
  const [criRateMax, setCriRateMax] = useState(36);
  const [criDamageMax, setCriDamageMax] = useState(49);
  const [effHitMax, setEffHitMax] = useState(56);
  const [effResMax, setEffResMax] = useState(56);
  const [speedMax, setSpeedMax] = useState(35);

  const colorByValue = (val: number) => {
    return val > 0 ? (attrsValid ? "blue" : "red") : "gray";
  };

  const equipAttributes = [
    {
      tooltip: "攻击百分比",
      image: "/statatkpercentdark.png",
      alt: "攻击%",
      max: atkPercentMax,
      percentage: true,
      value: atkPercent,
      setValue: setAtkPercent,
    },
    {
      tooltip: "攻击固定值",
      image: "/statatkdark.png",
      alt: "攻击",
      max: atkMax,
      percentage: false,
      value: atk,
      setValue: setAtk,
    },
    {
      tooltip: "防御百分比",
      image: "/statdefpercentdark.png",
      alt: "防御%",
      max: defPercentMax,
      percentage: true,
      value: defPercent,
      setValue: setDefPercent,
    },
    {
      tooltip: "防御固定值",
      image: "/statdefdark.png",
      alt: "防御",
      max: defMax,
      percentage: false,
      value: def,
      setValue: setDef,
    },
    {
      tooltip: "生命百分比",
      image: "/stathppercentdark.png",
      alt: "生命%",
      max: hpPercentMax,
      percentage: true,
      value: hpPercent,
      setValue: setHpPercent,
    },
    {
      tooltip: "生命固定值",
      image: "/stathpdark.png",
      alt: "生命",
      max: hpMax,
      percentage: false,
      value: hp,
      setValue: setHp,
    },
    {
      tooltip: "暴击几率",
      image: "/statcrdark.png",
      alt: "暴率",
      max: criRateMax,
      percentage: true,
      value: crPercent,
      setValue: setCrPercent,
    },
    {
      tooltip: "暴击伤害",
      image: "/statcddark.png",
      alt: "暴伤",
      max: criDamageMax,
      percentage: true,
      value: cdPercent,
      setValue: setCdPercent,
    },
    {
      tooltip: "效果命中百分比",
      image: "/stateffdark.png",
      alt: "效命",
      max: effHitMax,
      percentage: true,
      value: effPercent,
      setValue: setEffPercent,
    },
    {
      tooltip: "效果抵抗百分比",
      image: "/statresdark.png",
      alt: "效抗",
      max: effResMax,
      percentage: true,
      value: resPercent,
      setValue: setResPercent,
    },
    {
      tooltip: "速度固定值",
      image: "/statspddark.png",
      alt: "速度",
      max: speedMax,
      percentage: false,
      value: spd,
      setValue: setSpd,
    },
  ];

  const values = [
    atkPercent,
    atk,
    defPercent,
    def,
    hpPercent,
    hp,
    crPercent,
    cdPercent,
    effPercent,
    resPercent,
    spd,
  ];

  useEffect(() => {
    let count = 0;
    values.map((val) => {
      if (val) {
        count++;
      }
    });
    if (count > 4) {
      setTotalScore(0);
      setAtkScore(0);
      setDefScore(0);
      setAssScore(0);
      setAttrsValid(false);
      return;
    }

    setAttrsValid(true);
    let totalCount = 0;
    totalCount += atkPercent + atk / 11.27;
    totalCount += defPercent + (def * 4.99) / 31; // 6.212424849699399
    totalCount += hpPercent + hp / 56.31;
    totalCount += crPercent * 1.5 + cdPercent * 1.125;
    totalCount += effPercent + resPercent;
    totalCount += spd * 2;
    setTotalScore(totalCount);

    let atkCount = 0;
    atkCount += atkPercent + atk / 11.27;
    atkCount += crPercent * 1.5 + cdPercent * 1.125;
    atkCount += spd * 2;
    setAtkScore(atkCount);

    let defCount = 0;
    defCount += defPercent + (def * 4.99) / 31; // 6.212424849699399
    defCount += hpPercent + hp / 56.31;
    defCount += resPercent;
    defCount += spd * 2;
    setDefScore(defCount);

    let assCount = 0;
    assCount += defPercent + (def * 4.99) / 31; // 6.212424849699399
    assCount += hpPercent + hp / 56.31;
    assCount += effPercent + resPercent;
    assCount += spd * 2;
    setAssScore(assCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, values);

  useEffect(() => {
    setAtkMax(329);
    setAtkPercentMax(56);
    setDefMax(238);
    setDefPercentMax(56);
    setHpMax(1474);
    setHpPercentMax(56);
    setCriRateMax(36);
    setCriDamageMax(49);
    setEffHitMax(56);
    setEffResMax(56);
    setSpeedMax(35);
  }, [equipLevel, equipRarity, enhanceLevel]);

  const reset = () => {
    setAtkPercent(0);
    setAtk(0);
    setDefPercent(0);
    setDef(0);
    setHpPercent(0);
    setHp(0);
    setCrPercent(0);
    setCdPercent(0);
    setEffPercent(0);
    setResPercent(0);
    setSpd(0);
  };

  const renderedAttrs = equipAttributes.map((attr, index) => (
    <EquipAttribute
      tooltip={attr.tooltip}
      image={attr.image}
      alt={attr.alt}
      min={0}
      max={attr.max}
      key={`attr-${index}`}
      percentage={attr.percentage}
      value={attr.value}
      color={colorByValue(attr.value)}
      setValue={attr.setValue}
    />
  ));

  const renderValuedAttrs = equipAttributes.map((attr) =>
    attr.value > 0 ? (
      <Group noWrap spacing={0}>
        <Image
          width={30}
          color={attrsValid ? "blue" : "red"}
          src={attr.image}
          alt=""
        />
        <Text>{attr.value}</Text>
      </Group>
    ) : (
      <></>
    )
  );

  const hasValuedAttrs = () => {
    for (let i = 0; i < equipAttributes.length; i++) {
      if (equipAttributes[i].value > 0) {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <Card shadow="xl" p="md" mt="xs" withBorder>
        <SimpleGrid
          cols={2}
          pt="xs"
          breakpoints={[{ maxWidth: 1000, cols: 1, spacing: "sm" }]}
          spacing="xl"
        >
          {renderedAttrs}
        </SimpleGrid>
        <Card.Section p={20}>
          <Center>
            <Group noWrap mt={10}>
              <Button
                leftIcon={<IconX size={24} />}
                onClick={reset}
                variant="gradient"
                gradient={{ from: "teal", to: "lime", deg: 105 }}
              >
                重置
              </Button>
            </Group>
          </Center>
        </Card.Section>
      </Card>
      <Card shadow="lg" mt="md">
        <Card.Section pt={10}>
          {hasValuedAttrs() ? (
            <Center>
              <Group noWrap>{renderValuedAttrs}</Group>
            </Center>
          ) : (
            <></>
          )}
          <Center m={8}>
            <Group noWrap spacing="xs">
              <Text weight={700} size="xl">
                总分:
              </Text>
              <Text weight={700} size="xl" color={attrsValid ? "blue" : "red"}>
                {totalScore.toFixed(1)}
              </Text>
            </Group>
          </Center>
        </Card.Section>
        <Divider my={5} variant="dashed" />
        <Card.Section p={10}>
          <Center>
            <Group spacing="xl">
              <Group noWrap spacing="xs">
                <Text weight={500}>输出分:</Text>
                <Text weight={500} color={attrsValid ? "blue" : "red"}>
                  {atkScore.toFixed(1)}
                </Text>
              </Group>
              <Group noWrap spacing="xs">
                <Text weight={500}>防御分:</Text>
                <Text weight={500} color={attrsValid ? "blue" : "red"}>
                  {defScore.toFixed(1)}
                </Text>
              </Group>
              <Group noWrap spacing="xs">
                <Text weight={500}>辅助分:</Text>
                <Text weight={500} color={attrsValid ? "blue" : "red"}>
                  {assScore.toFixed(1)}
                </Text>
              </Group>
            </Group>
          </Center>
        </Card.Section>
      </Card>
    </>
  );
};
