
import { ResourceType, CardState, Rarity, UpgradesState, Inventory } from '../types.ts';

/**
 * Upgrade Definitions
 */
export const MAX_LEVEL = 5;

export const getUpgradeCost = (rarity: Rarity, level: number): Partial<Inventory> => {
  const multiplier = Math.pow(2.5, level);
  switch (rarity) {
    case Rarity.UNCOMMON:
      return { [ResourceType.GOLD]: Math.floor(250 * multiplier) };
    case Rarity.RARE:
      return { [ResourceType.GOLD]: Math.floor(1000 * multiplier), [ResourceType.ENERGY]: Math.floor(50 * multiplier) };
    case Rarity.ULTRA_RARE:
      return { [ResourceType.GOLD]: Math.floor(5000 * multiplier), [ResourceType.MATERIALS]: Math.floor(200 * multiplier) };
    default:
      return { [ResourceType.GOLD]: 100 };
  }
};

export const getRarityChances = (upgrades: UpgradesState) => {
  const baseUncommon = 0.04;
  const baseRare = 0.009;
  const baseUltraRare = 0.001;

  const uncommon = baseUncommon + (upgrades.uncommonLevel * 0.05); 
  const rare = baseRare + (upgrades.rareLevel * 0.02);
  const ultraRare = baseUltraRare + (upgrades.ultraRareLevel * 0.01);

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
  let max = 100;

  switch (rarity) {
    case Rarity.COMMON:
      min = 1; max = 100;
      break;
    case Rarity.UNCOMMON:
      min = 101; max = 350;
      break;
    case Rarity.RARE:
      min = 351; max = 700;
      break;
    case Rarity.ULTRA_RARE:
      min = 701; max = 1000;
      break;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomResourceType = (): ResourceType => {
  const types = Object.values(ResourceType);
  return types[Math.floor(Math.random() * types.length)];
};

export const generateNewCards = (upgrades: UpgradesState): CardState[] => {
  return [1, 2, 3].map((num) => {
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
