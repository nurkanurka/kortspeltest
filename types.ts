export enum ResourceType {
  GOLD = 'GOLD',
  MATERIALS = 'MATERIALS'
}

export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  ULTRA_RARE = 'ULTRA_RARE'
}

export interface ResourceInfo {
  type: ResourceType;
  amount: number;
  rarity: Rarity;
}

export interface CardState {
  id: string;
  resource: ResourceInfo;
}

export interface Inventory {
  [ResourceType.GOLD]: number;
  [ResourceType.MATERIALS]: number;
}

export interface UpgradeLevel {
  uncommonChance: number;
  rareChance: number;
  ultraRareChance: number;
  costs: Partial<Inventory>;
}

export interface UpgradesState {
  luckLevel: number;
  maxCardsLevel: number;
}