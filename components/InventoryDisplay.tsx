
import React from 'react';
import { Inventory, ResourceType } from '../types';
import { RESOURCE_CONFIG } from '../constants';

interface InventoryDisplayProps {
  inventory: Inventory;
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ inventory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-6 bg-transparent relative z-50">
      {/* Wood/Stone Bar background */}
      <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
      
      {Object.values(ResourceType).map((type) => {
        const config = RESOURCE_CONFIG[type];
        return (
          <div 
            key={type} 
            className="group flex items-center gap-4 px-6 py-3 rounded-xl bg-[#2d1e14] border-2 border-[#c0a060]/60 shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all hover:scale-105 hover:border-[#c0a060]"
          >
            <div className={`${config.color} drop-shadow-[0_0_8px_currentColor] transition-transform group-hover:scale-110`}>
              {/* Fix: Casting to React.ReactElement with className prop allows cloneElement to correctly type the props object */}
              {React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7" })}
            </div>
            <div className="flex flex-col border-l border-[#c0a060]/20 pl-4">
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#c0a060] leading-none mb-1">
                {config.label}
              </span>
              <span className="text-2xl font-black font-fantasy tabular-nums text-white text-shadow-fantasy">
                {inventory[type].toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryDisplay;
