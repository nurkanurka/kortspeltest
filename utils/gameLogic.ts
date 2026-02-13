import { ResourceType, CardState, Rarity, UpgradesState, Inventory } from '../types.ts';

/**
 * Upgrade Definitions
 */
export const MAX_LUCK_LEVEL = 100;
export const MAX_CARDS_LEVEL = 3; // 0 (1 card) to 3 (4 cards)

export const getLuckUpgradeCost = (level: number = 0): Partial<Inventory> => {
  // Luck only costs Gold
  const safeLevel = isNaN(level) ? 0 : level;
  const goldCost = Math.floor(100 * Math.pow(1.12, safeLevel));
  return { [ResourceType.GOLD]: goldCost };
};

export const getCardsUpgradeCost = (level: number = 0): Partial<Inventory> => {
  // Max cards only costs Materials
  const safeLevel = isNaN(level) ? 0 : level;
  const materialCost = Math.floor(50 * Math.pow(5, safeLevel));
  return { [ResourceType.MATERIALS]: materialCost };
};

export const getRarityChances = (upgrades: UpgradesState) => {
  const level = upgrades.luckLevel || 0;
  
  // Base chances
  const baseUncommon = 0.04;
  const baseRare = 0.009;
  const baseUltraRare = 0.001;

  // Max improvements (at level 100)
  const maxBonusUncommon = 0.35;
  const maxBonusRare = 0.15;
  const maxBonusUltraRare = 0.05;

  // Linear interpolation for level 0-100
  const progress = level / MAX_LUCK_LEVEL;

  const uncommon = baseUncommon + (maxBonusUncommon * progress);
  const rare = baseRare + (maxBonusRare * progress);
  const ultraRare = baseUltraRare + (maxBonusUltraRare * progress);

  const common = Math.max(0.1, 1 - (uncommon + rare + ultraRare));

  return { common, uncommon, rare, ultraRare };
};

const getWeightedRarity = (upgrades: UpgradesState): Rarity => {
  const chances = getRarityChances(upgrades);
  const roll = Math.random();

  if (roll < chances.ultraRare) return Rarity.ULTRA_RARE;
  if (roll < chances.ultraRare + chances.rare) return Rarity.RARE;
  if (roll < chances.ultraRare + chances.rare + chances.uncommon) return Rarity.UNCOMMON;
  return Rarity.COMMON;
};

const getAmountForRarity = (rarity: Rarity): number => {
  let min = 1;
  let max = 10;

  switch (rarity) {
    case Rarity.COMMON:
      min = 1; max = 10;
      break;
    case Rarity.UNCOMMON:
      min = 10; max = 20;
      break;
    case Rarity.RARE:
      min = 20; max = 70;
      break;
    case Rarity.ULTRA_RARE:
      min = 70; max = 100;
      break;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomResourceType = (): ResourceType => {
  const types = Object.values(ResourceType);
  return types[Math.floor(Math.random() * types.length)];
};

export const generateNewCards = (upgrades: UpgradesState): CardState[] => {
  const count = 1 + (upgrades.maxCardsLevel || 0);
  return Array.from({ length: count }).map((_, num) => {
    const rarity = getWeightedRarity(upgrades);
    const amount = getAmountForRarity(rarity);
    return {
      id: `card-${Date.now()}-${num}-${Math.random()}`,
      resource: {
        type: getRandomResourceType(),
        amount: amount,
        rarity: rarity
      }
    };
  });
};