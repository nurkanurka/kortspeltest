
import React from 'react';
import { ResourceType, Rarity } from './types';

export const RESOURCE_CONFIG = {
  [ResourceType.GOLD]: {
    label: 'Gold',
    color: 'text-yellow-400',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>
    )
  },
  [ResourceType.ENERGY]: {
    label: 'Mana',
    color: 'text-blue-400',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9v8l10-12h-9l1-8z"/>
      </svg>
    )
  },
  [ResourceType.MATERIALS]: {
    label: 'Materials',
    color: 'text-emerald-400',
    icon: (
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5c0-1.1-.9-2-2-2s-2 .9-2 2V5H5c-1.1 0-2 .9-2 2v4H1.5c-1.1 0-2 .9-2 2s.9 2 2 2H3v4c0 1.1.9 2 2 2h4v1.5c0 1.1.9 2 2 2s2-.9 2-2V19h4c1.1 0 2-.9 2-2v-4h1.5c1.1 0 2-.9 2-2s-.9-2-2-2z"/>
      </svg>
    )
  }
};

export const RARITY_CONFIG = {
  [Rarity.COMMON]: { 
    color: 'text-blue-400', 
    border: 'border-blue-500', 
    gem: 'bg-blue-400', 
    glow: 'rarity-glow-common',
    backGradient: 'from-blue-700 via-blue-900 to-blue-950',
    backBorder: 'border-blue-400',
    accentColor: 'text-blue-300',
    prompt: "A cartoonish fantasy card back design, primary color blue, featuring a central glowing magical portal or swirl, thick stylized wooden borders, hearthstone game art style, high quality, digital illustration, centered composition."
  },
  [Rarity.UNCOMMON]: { 
    color: 'text-green-400', 
    border: 'border-green-500', 
    gem: 'bg-green-500', 
    glow: 'rarity-glow-uncommon',
    backGradient: 'from-emerald-600 via-emerald-800 to-emerald-950',
    backBorder: 'border-emerald-400',
    accentColor: 'text-emerald-300',
    prompt: "A cartoonish fantasy card back design, primary color green, featuring forest leaves and ancient glowing druidic runes, thick stone borders, hearthstone game art style, high quality, digital illustration, centered composition."
  },
  [Rarity.RARE]: { 
    color: 'text-slate-100', 
    border: 'border-slate-300', 
    gem: 'bg-slate-300', 
    glow: 'rarity-glow-rare',
    backGradient: 'from-slate-400 via-slate-600 to-slate-800',
    backBorder: 'border-slate-100',
    accentColor: 'text-white',
    prompt: "A cartoonish fantasy card back design, primary color silver and white, featuring celestial stars and a moon symbol, ornate silver filigree borders, hearthstone game art style, high quality, digital illustration, centered composition."
  },
  [Rarity.ULTRA_RARE]: { 
    color: 'text-yellow-400', 
    border: 'border-yellow-500', 
    gem: 'bg-yellow-500', 
    glow: 'rarity-glow-legendary',
    backGradient: 'from-amber-400 via-amber-600 to-amber-900',
    backBorder: 'border-yellow-200',
    accentColor: 'text-yellow-200',
    prompt: "A cartoonish fantasy card back design, primary color gold and amber, featuring a glowing dragon head or phoenix egg, intricate gold plated borders, sparkling magical particles, hearthstone game art style, high quality, digital illustration, centered composition."
  },
};
