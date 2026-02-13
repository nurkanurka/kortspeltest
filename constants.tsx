import React from 'react';
import { ResourceType, Rarity } from './types.ts';

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
    backImage: 'https://image2url.com/r2/default/images/1770970760490-400676c7-a897-453e-88d6-12c5ae7dc813.png'
  },
  [Rarity.UNCOMMON]: { 
    color: 'text-green-400', 
    border: 'border-green-500', 
    gem: 'bg-green-500', 
    glow: 'rarity-glow-uncommon',
    backGradient: 'from-emerald-600 via-emerald-800 to-emerald-950',
    backBorder: 'border-emerald-400',
    accentColor: 'text-emerald-300',
    backImage: 'https://image2url.com/r2/default/images/1770970838038-0614dfe5-048b-4e18-a3b1-a99851d5b2f8.png'
  },
  [Rarity.RARE]: { 
    color: 'text-slate-100', 
    border: 'border-slate-300', 
    gem: 'bg-slate-300', 
    glow: 'rarity-glow-rare',
    backGradient: 'from-slate-400 via-slate-600 to-slate-800',
    backBorder: 'border-slate-100',
    accentColor: 'text-white',
    backImage: 'https://image2url.com/r2/default/images/1770970856338-2249b4a2-f6e3-4cf8-b4da-482cadb8a71e.png'
  },
  [Rarity.ULTRA_RARE]: { 
    color: 'text-yellow-400', 
    border: 'border-yellow-500', 
    gem: 'bg-yellow-500', 
    glow: 'rarity-glow-legendary',
    backGradient: 'from-amber-400 via-amber-600 to-amber-900',
    backBorder: 'border-yellow-200',
    accentColor: 'text-yellow-200',
    backImage: 'https://image2url.com/r2/default/images/1770970873957-fa88d4e9-bcba-4223-8f12-ea2894165862.png'
  },
};