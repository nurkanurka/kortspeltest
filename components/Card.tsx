
import React from 'react';
import { CardState, Rarity } from '../types';
import { RESOURCE_CONFIG, RARITY_CONFIG } from '../constants';

interface CardProps {
  card: CardState;
  isFlipped: boolean;
  isHidden: boolean;
  isChosen: boolean;
  onFlip: (id: string) => void;
  disabled: boolean;
  offsetToCenter?: { x: number; y: number };
}

const Card: React.FC<CardProps> = ({ card, isFlipped, isHidden, isChosen, onFlip, disabled, offsetToCenter }) => {
  const resConfig = RESOURCE_CONFIG[card.resource.type];
  const rarityConfig = RARITY_CONFIG[card.resource.rarity];

  const centerTransform = isChosen && offsetToCenter 
    ? `translate(${offsetToCenter.x}px, ${offsetToCenter.y - 40}px) scale(1.1)` 
    : isChosen ? 'translateY(-40px) scale(1.1)' : '';

  return (
    <div 
      className={`
        relative w-56 h-80 perspective-1000 transition-all duration-700 ease-in-out cursor-pointer
        ${isHidden ? 'opacity-0 scale-50 rotate-x-12 pointer-events-none' : 'opacity-100'}
        ${isChosen ? 'z-50' : 'z-10'}
      `}
      style={{ transform: centerTransform }}
      onClick={() => !disabled && onFlip(card.id)}
    >
      <div 
        className={`
          relative w-full h-full transform-style-3d transition-transform
          ${isChosen ? 'duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]' : 'duration-600'}
          ${isFlipped ? 'rotate-y-180' : ''}
          ${isChosen ? 'victory-glow-active rounded-2xl' : ''}
        `}
      >
        {/* Card Back - Cartoonish Fantasy Theme (CSS Only) */}
        <div className={`absolute inset-0 backface-hidden flex items-center justify-center rounded-2xl border-[10px] ${rarityConfig.backBorder} shadow-2xl overflow-hidden group`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.backGradient}`}></div>
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`, backgroundSize: '16px 16px' }}></div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {/* Ornate Inner Frame */}
            <div className={`w-full h-full border-[2px] ${rarityConfig.backBorder} rounded-xl p-2 flex items-center justify-center relative bg-black/10`}>
              
              {/* Magic Symbol Centerpiece */}
              <div className={`w-36 h-36 rounded-full border-[6px] ${rarityConfig.backBorder} flex items-center justify-center bg-black/40 shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden`}>
                <div className={`w-full h-full flex items-center justify-center relative ${!disabled ? 'animate-spin-slow' : ''}`}>
                  <svg className={`w-24 h-24 ${rarityConfig.accentColor} opacity-80`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="50" cy="50" r="40" strokeDasharray="10 5" />
                    <path d="M50 10 L50 90 M10 50 L90 50 M25 25 L75 75 M25 75 L75 25" strokeDasharray="2 2" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" className="animate-pulse" />
                  </svg>
                </div>
              </div>

              {/* Decorative Corners */}
              <div className={`absolute -top-1 -left-1 w-12 h-12 bg-inherit border-[4px] ${rarityConfig.backBorder} rounded-tl-lg rotate-45 transform -translate-x-1/2 -translate-y-1/2 shadow-md`}></div>
              <div className={`absolute -top-1 -right-1 w-12 h-12 bg-inherit border-[4px] ${rarityConfig.backBorder} rounded-tr-lg -rotate-45 transform translate-x-1/2 -translate-y-1/2 shadow-md`}></div>
              <div className={`absolute -bottom-1 -left-1 w-12 h-12 bg-inherit border-[4px] ${rarityConfig.backBorder} rounded-bl-lg -rotate-45 transform -translate-x-1/2 translate-y-1/2 shadow-md`}></div>
              <div className={`absolute -bottom-1 -right-1 w-12 h-12 bg-inherit border-[4px] ${rarityConfig.backBorder} rounded-br-lg rotate-45 transform translate-x-1/2 translate-y-1/2 shadow-md`}></div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <span className={`font-fantasy text-5xl ${rarityConfig.accentColor} font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>?</span>
              </div>
            </div>
          </div>
          
          {!disabled && (
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          )}
        </div>

        {/* Card Front */}
        <div 
          className={`
            absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center bg-[#2d241d] rounded-2xl border-[8px] ${rarityConfig.border} overflow-hidden
            ${rarityConfig.glow}
          `}
        >
          <div className="w-full h-1/2 bg-[#1a1410] flex items-center justify-center relative overflow-hidden card-inner-shadow">
             <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
             <div className={`${resConfig.color} transform scale-150 drop-shadow-[0_0_15px_currentColor]`}>
                {resConfig.icon}
             </div>
             
             {card.resource.rarity === Rarity.ULTRA_RARE && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(251,191,36,0.1)_100%)] animate-pulse"></div>
             )}
          </div>

          <div className={`w-full bg-[#1a1410] py-1 border-y-2 ${rarityConfig.border} flex justify-center shadow-md relative z-20`}>
             <span className="font-fantasy text-[10px] font-black tracking-[0.2em] text-[#c0a060] uppercase">
                {resConfig.label}
             </span>
          </div>

          <div className="flex-1 w-full bg-[#3d2b1f] p-4 flex flex-col items-center justify-center relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
             
             <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-8 rounded-full border-2 border-[#c0a060] ${rarityConfig.gem} shadow-lg z-30`}></div>

             <div className="relative z-10 flex flex-col items-center">
                <span className="text-4xl font-fantasy font-black text-white text-shadow-fantasy leading-none">
                   +{card.resource.amount}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${rarityConfig.color}`}>
                   {card.resource.rarity.replace('_', ' ')}
                </span>
             </div>
          </div>

          <div className={`w-full h-4 bg-black/20 flex items-center justify-center`}>
             <div className={`w-1/2 h-[2px] ${rarityConfig.border} opacity-40`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
