// https://page.onstove.com/epicseven/TW/view/7872400

export enum Rarity {
  Epic = 'epic',
  Heroic = 'heroic',
}

export enum Attribute {
  Attack = 'attack',
  AttackPercent = 'attackPercent',
  Defense = 'defense',
  DefensePercent = 'defensePercent',
  Health = 'health',
  HealthPercent = 'healthPercent',
  Speed = 'speed',
  CriticalHitChancePercent = 'criChancePercent',
  CriticalHitDamagePercent = 'criDamagePercent',
  EffectivenessPercent = 'effPercent',
  EffectResistencePercent = 'effResPercent',
}

//////////////////////////////////////////////////////////////////////////////////////////
// 基于2022-05-25的数据：
// https://page.onstove.com/epicseven/global/view/7902683

type EquipEnhanceProbility = {
  rarity: Rarity;
  values: number[];
  probabilities: number[];
};

export const equipLv88Attacks: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53],
    probabilities: [
      0.579, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435, 6.435,
      6.435, 6.435, 6.435, 2.896,
    ],
  },
  {
    rarity: Rarity.Heroic,
    values: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    probabilities: [
      6.678, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773, 6.773,
      6.773, 5.27,
    ],
  },
];

export const equipLv88AttackPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv88Defenses: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [32, 33, 34, 35, 36, 37, 38, 39, 40],
    probabilities: [12.484, 12.484, 12.484, 12.484, 12.484, 12.484, 12.484, 12.484, 0.125],
  },
  {
    rarity: Rarity.Heroic,
    values: [30, 31, 32, 33, 34, 35, 36, 37, 38],
    probabilities: [8.005, 13.123, 13.123, 13.123, 13.123, 13.123, 13.123, 13.123, 0.131],
  },
];

export const equipLv88DefensePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv88Healthes: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [
      178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
      197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215,
      216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229,
    ],
    probabilities: [
      1.0, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96,
      1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96,
      1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96, 1.96,
      1.96, 1.96, 1.96, 1.96, 1.96, 1.0,
    ],
  },
  {
    rarity: Rarity.Heroic,
    values: [
      169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187,
      188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206,
      207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218,
    ],
    probabilities: [
      0.887, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064,
      2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064,
      2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064,
      2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 2.064, 0.062,
    ],
  },
];

export const equipLv88HealthPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv88Speeds: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [3, 4, 5],
    probabilities: [49.751, 49.751, 0.498],
  },
  {
    rarity: Rarity.Heroic,
    values: [2, 3, 4],
    probabilities: [8.333, 52.083, 39.583],
  },
];

export const equipLv88EffectivenessPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv88EffectResistencePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [5, 6, 7, 8, 9],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv88CriticalHitChancePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [3, 4, 5, 6],
    probabilities: [25, 25, 25, 25],
  },
  {
    rarity: Rarity.Heroic,
    values: [3, 4, 5, 6],
    probabilities: [25, 25, 25, 25],
  },
];

export const equipLv88CriticalHitDamagePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

// lv 72 ~ 85

export const equipLv85Attacks: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    probabilities: [
      6.103, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353, 7.353,
      5.662,
    ],
  },
  {
    rarity: Rarity.Heroic,
    values: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    probabilities: [
      3.718, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746, 7.746,
      3.331,
    ],
  },
];

export const equipLv85AttackPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv85Defenses: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [28, 29, 30, 31, 32, 33, 34, 35],
    probabilities: [14.265, 14.265, 14.265, 14.265, 14.265, 14.265, 14.265, 0.143],
  },
  {
    rarity: Rarity.Heroic,
    values: [26, 27, 28, 29, 30, 31, 32, 33],
    probabilities: [6.147, 14.993, 14.993, 14.993, 14.993, 14.993, 14.993, 3.998],
  },
];

export const equipLv85DefensePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv85Healthes: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [
      157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
      176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
      195, 196, 197, 198, 199, 200, 201, 202,
    ],
    probabilities: [
      1.133, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221,
      2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221,
      2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 2.221,
      2.221, 2.221, 2.221, 2.221, 2.221, 2.221, 1.133,
    ],
  },
  {
    rarity: Rarity.Heroic,
    values: [
      149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167,
      168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186,
      187, 188, 189, 190, 191, 192,
    ],
    probabilities: [
      0.889, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339,
      2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339,
      2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339, 2.339,
      2.339, 2.339, 2.339, 2.339, 0.889,
    ],
  },
];

export const equipLv85HealthPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv85Speeds: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [2, 3, 4, 5],
    probabilities: [33.223, 33.223, 33.223, 0.332],
  },
  {
    rarity: Rarity.Heroic,
    values: [1, 2, 3, 4],
    probabilities: [3.833, 34.843, 34.843, 26.481],
  },
];

export const equipLv85EffectivenessPercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv85EffectResistencePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7, 8],
    probabilities: [20, 20, 20, 20, 20],
  },
];

export const equipLv85CriticalHitChancePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [3, 4, 5],
    probabilities: [33.333, 33.333, 33.333],
  },
  {
    rarity: Rarity.Heroic,
    values: [3, 4, 5],
    probabilities: [33.333, 33.333, 33.333],
  },
];

export const equipLv85CriticalHitDamagePercents: EquipEnhanceProbility[] = [
  {
    rarity: Rarity.Epic,
    values: [4, 5, 6, 7],
    probabilities: [25, 25, 25, 25],
  },
  {
    rarity: Rarity.Heroic,
    values: [4, 5, 6, 7],
    probabilities: [25, 25, 25, 25],
  },
];

export function getEquipEnhanceProbilities(equipLv: number, attr: Attribute) {
  const pList = [
    {
      lvMin: 72,
      lvMax: 85,
      list: [
        equipLv85Attacks,
        equipLv85AttackPercents,
        equipLv85Defenses,
        equipLv85DefensePercents,
        equipLv85Healthes,
        equipLv85HealthPercents,
        equipLv85Speeds,
        equipLv85EffectivenessPercents,
        equipLv85EffectResistencePercents,
        equipLv85CriticalHitChancePercents,
        equipLv85CriticalHitDamagePercents,
      ],
    },
    {
      lvMin: 88,
      lvMax: 88,
      list: [
        equipLv88Attacks,
        equipLv88AttackPercents,
        equipLv88Defenses,
        equipLv88DefensePercents,
        equipLv88Healthes,
        equipLv88HealthPercents,
        equipLv88Speeds,
        equipLv88EffectivenessPercents,
        equipLv88EffectResistencePercents,
        equipLv88CriticalHitChancePercents,
        equipLv88CriticalHitDamagePercents,
      ],
    },
  ];

  const attributes = Object.values(Attribute);
  console.info('attributes', attributes);
  const index = attributes.findIndex((e) => e === attr);
  console.info(attr, 'index', index);
  for (let i = 0; i < pList.length; i++) {
    if (equipLv >= pList[i].lvMin && equipLv <= pList[i].lvMax) {
      return pList[i].list[index];
    }
  }
  return [];
}

export function getEquipEnhanceProbility(equipLv: number, equipRarity: Rarity, attr: Attribute) {
  const probabilities = getEquipEnhanceProbilities(equipLv, attr);
  for (let i = 0; i < probabilities?.length; i++) {
    const probility = probabilities[i];
    if (probility.rarity === equipRarity) {
      return probility;
    }
  }
  return null;
}

function doGetAttributeMaxValue(
  equipLv: number,
  equipRarity: Rarity,
  enhanceLv: number,
  attr: Attribute
) {
  const probability = getEquipEnhanceProbility(equipLv, equipRarity, attr);
  if (!probability) {
    return 0;
  }
  const count = enhanceLv / 3; // 强化3次，副值跳一次
  return probability.values[probability.values.length - 1] * (count + 1);
}

export function getAttributeMax(
  equipLv: number,
  equipRarity: Rarity,
  enhanceLv: number,
  attr: Attribute
) {
  if (equipLv < 90) {
    return doGetAttributeMaxValue(equipLv, equipRarity, enhanceLv, attr);
  }

  // 重铸，只有85级装备能升级到90
  let val = doGetAttributeMaxValue(85, equipRarity, enhanceLv, attr);
  return val;
}
