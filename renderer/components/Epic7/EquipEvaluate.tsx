import { useEffect, useState } from 'react';
import Head from 'next/head';
import { IconX } from '@tabler/icons';
import {
  Center,
  Container,
  SimpleGrid,
  Card,
  Divider,
  Group,
  Text,
  Button,
  Image,
  Radio,
} from '@mantine/core';
import { EquipAttribute } from '../EquipAttribute';
import { Attribute, getAttributeMax, Rarity } from '../../utils/data';

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
    return val > 0 ? (attrsValid ? 'blue' : 'red') : 'gray';
  };

  const equipAttributes = [
    {
      tooltip: '???????????????',
      image: '/statatkpercentdark.png',
      alt: '??????%',
      max: atkPercentMax,
      percentage: true,
      value: atkPercent,
      setValue: setAtkPercent,
    },
    {
      tooltip: '???????????????',
      image: '/statatkdark.png',
      alt: '??????',
      max: atkMax,
      percentage: false,
      value: atk,
      setValue: setAtk,
    },
    {
      tooltip: '???????????????',
      image: '/statdefpercentdark.png',
      alt: '??????%',
      max: defPercentMax,
      percentage: true,
      value: defPercent,
      setValue: setDefPercent,
    },
    {
      tooltip: '???????????????',
      image: '/statdefdark.png',
      alt: '??????',
      max: defMax,
      percentage: false,
      value: def,
      setValue: setDef,
    },
    {
      tooltip: '???????????????',
      image: '/stathppercentdark.png',
      alt: '??????%',
      max: hpPercentMax,
      percentage: true,
      value: hpPercent,
      setValue: setHpPercent,
    },
    {
      tooltip: '???????????????',
      image: '/stathpdark.png',
      alt: '??????',
      max: hpMax,
      percentage: false,
      value: hp,
      setValue: setHp,
    },
    {
      tooltip: '????????????',
      image: '/statcrdark.png',
      alt: '??????',
      max: criRateMax,
      percentage: true,
      value: crPercent,
      setValue: setCrPercent,
    },
    {
      tooltip: '????????????',
      image: '/statcddark.png',
      alt: '??????',
      max: criDamageMax,
      percentage: true,
      value: cdPercent,
      setValue: setCdPercent,
    },
    {
      tooltip: '?????????????????????',
      image: '/stateffdark.png',
      alt: '??????',
      max: effHitMax,
      percentage: true,
      value: effPercent,
      setValue: setEffPercent,
    },
    {
      tooltip: '?????????????????????',
      image: '/statresdark.png',
      alt: '??????',
      max: effResMax,
      percentage: true,
      value: resPercent,
      setValue: setResPercent,
    },
    {
      tooltip: '???????????????',
      image: '/statspddark.png',
      alt: '??????',
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
    // setAtkMax(getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.Attack));
    // setAtkPercentMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.AttackPercent)
    // );
    // setDefMax(getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.Defense));
    // setDefPercentMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.DefensePercent)
    // );
    // setHpMax(getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.Health));
    // setHpPercentMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.HealthPercent)
    // );
    // setCriRateMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.CriticalHitChancePercent)
    // );
    // setCriDamageMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.CriticalHitDamagePercent)
    // );
    // setEffHitMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.EffectivenessPercent)
    // );
    // setEffResMax(
    //   getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.EffectResistencePercent)
    // );
    // setSpeedMax(getAttributeMax(equipLevel, equipRarity, enhanceLevel, Attribute.Speed));
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
        <Image width={30} color={attrsValid ? 'blue' : 'red'} src={attr.image} alt="" />
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
      {/* <Head>
        <title>E7?????????????????? - Joyqoo</title>
        <meta name="keywords" content="Epic 7, Epic Seven, ????????????, ??????, ??????, ??????, ??????" />
        <meta name="description" content="???????????????????????????????????????" />
      </Head> */}

      {/* <Container size={'xl'}> */}
        {/* <Center>
          <h2>??????????????????????????????</h2>
        </Center> */}

        {/* <Card shadow="xs" radius="md" withBorder>
          <Group noWrap spacing="xl" position="center">
            <Radio.Group
              value={`${equipLevel}`}
              name="level"
              label="????????????"
              withAsterisk
              onChange={(v: string) => {
                if (v === '90') {
                  setEnhanceLevel(15);
                }
                setEquipLevel(+v);
              }}
            >
              <Radio value="85" label="72~85???" />
              <Radio value="88" label="88???" />
              <Radio value="90" label="90???" />
            </Radio.Group>
            <Divider orientation="vertical" />
            <Radio.Group
              value={equipRarity}
              name="rarity"
              label="???????????????"
              withAsterisk
              onChange={(v: string) => setEquipRarity(v as Rarity)}
            >
              <Radio value={Rarity.Heroic} label="??????" />
              <Radio value={Rarity.Epic} label="??????" />
            </Radio.Group>
            <Divider orientation="vertical" />
            <Radio.Group
              value={`${enhanceLevel}`}
              name="enhanced"
              label="??????????????????"
              withAsterisk
              onChange={(v: string) => {
                if (v === '0' && equipLevel === 90) {
                  return;
                }
                setEnhanceLevel(+v);
              }}
            >
              <Radio value="0" label="+0" />
              <Radio value="15" label="+15" />
            </Radio.Group>
          </Group>
        </Card> */}
        <Card shadow="xl" p="md" mt="xs" withBorder>
          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 1000, cols: 1, spacing: 'sm' }]}
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
                  gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                >
                  ??????
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
                  ??????:
                </Text>
                <Text weight={700} size="xl" color={attrsValid ? 'blue' : 'red'}>
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
                  <Text weight={500}>?????????:</Text>
                  <Text weight={500} color={attrsValid ? 'blue' : 'red'}>
                    {atkScore.toFixed(1)}
                  </Text>
                </Group>
                <Group noWrap spacing="xs">
                  <Text weight={500}>?????????:</Text>
                  <Text weight={500} color={attrsValid ? 'blue' : 'red'}>
                    {defScore.toFixed(1)}
                  </Text>
                </Group>
                <Group noWrap spacing="xs">
                  <Text weight={500}>?????????:</Text>
                  <Text weight={500} color={attrsValid ? 'blue' : 'red'}>
                    {assScore.toFixed(1)}
                  </Text>
                </Group>
              </Group>
            </Center>
          </Card.Section>
        </Card>
      {/* </Container> */}
    </>
  );
};
