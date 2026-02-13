
import React from 'react';
import { Inventory, ResourceType } from '../types.ts';
import { RESOURCE_CONFIG } from '../constants.tsx';

interface InventoryDisplayProps {
  inventory: Inventory;
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ inventory }) => {
  return (
    <div className="fixed left-0 top-0 flex flex-col gap-2 p-4 md:p-6 z-50 pointer-events-none">
      {/* Side gradient for readability */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black/40 to-transparent pointer-events-none h-64"></div>
      
      <div className="flex flex-col gap-2 pointer-events-auto">
        {Object.values(ResourceType).map((type) => {
          const config = RESOURCE_CONFIG[type];
          return (
            <div 
              key={type} 
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1410]/90 border border-[#c0a060]/30 shadow-lg transition-all hover:scale-105 hover:border-[#c0a060] backdrop-blur-sm"
            >
              <div className={`${config.color} drop-shadow-[0_0_3px_currentColor] transition-transform group-hover:scale-110`}>
                {React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
              </div>
              <div className="flex flex-col border-l border-[#c0a060]/20 pl-2">
                <span className="text-[7px] uppercase font-black tracking-[0.1em] text-[#c0a060] leading-none mb-0.5 opacity-70">
                  {config.label}
                </span>
                <span className="text-base font-black font-fantasy tabular-nums text-white text-shadow-fantasy leading-none">
                  {inventory[type].toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Short decorative vertical line */}
      <div className="w-px h-12 bg-gradient-to-b from-[#c0a060]/30 to-transparent ml-1"></div>
    </div>
  );
};

export default InventoryDisplay;
