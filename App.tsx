import React, { useState, useEffect, useCallback } from 'react';
import { CardState, Inventory, ResourceType, UpgradesState, Rarity } from './types.ts';
import { generateNewCards, getLuckUpgradeCost, getCardsUpgradeCost, MAX_LUCK_LEVEL, MAX_CARDS_LEVEL } from './utils/gameLogic.ts';
import Card from './components/Card.tsx';
import InventoryDisplay from './components/InventoryDisplay.tsx';
import { RESOURCE_CONFIG } from './constants.tsx';

const App: React.FC = () => {
  const [cards, setCards] = useState<CardState[]>([]);
  
  const [inventory, setInventory] = useState<Inventory>(() => {
    const defaults = {
      [ResourceType.GOLD]: 0,
      [ResourceType.MATERIALS]: 0,
    };
    try {
      const saved = localStorage.getItem('tavern-inventory');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
      return defaults;
    } catch (e) {
      console.error("Failed to parse inventory from localStorage", e);
      return defaults;
    }
  });
  
  const [upgrades, setUpgrades] = useState<UpgradesState>(() => {
    const defaults = {
      luckLevel: 0,
      maxCardsLevel: 0,
    };
    try {
      const saved = localStorage.getItem('tavern-upgrades');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
      return defaults;
    } catch (e) {
      console.error("Failed to parse upgrades from localStorage", e);
      return defaults;
    }
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  // Persistence
  useEffect(() => {
    localStorage.setItem('tavern-inventory', JSON.stringify(inventory));
    localStorage.setItem('tavern-upgrades', JSON.stringify(upgrades));
  }, [inventory, upgrades]);

  // Initialize cards on mount or upgrade to slot count
  useEffect(() => {
    setCards(generateNewCards(upgrades));
  }, [upgrades.maxCardsLevel]);

  const handleCardFlip = useCallback((id: string) => {
    if (selectedId || isResetting) return;

    setSelectedId(id);
    const selectedCard = cards.find(c => c.id === id);
    
    if (selectedCard) {
      setInventory(prev => ({
        ...prev,
        [selectedCard.resource.type]: prev[selectedCard.resource.type] + selectedCard.resource.amount
      }));
    }

    setTimeout(() => {
      setIsResetting(true);
      setTimeout(() => {
        setCards(generateNewCards(upgrades));
        setSelectedId(null);
        setIsResetting(false);
      }, 800);
    }, 2800); 
  }, [cards, selectedId, isResetting, upgrades]);

  const buyLuckUpgrade = () => {
    const currentLevel = upgrades.luckLevel || 0;
    if (currentLevel >= MAX_LUCK_LEVEL) return;
    const costs = getLuckUpgradeCost(currentLevel);
    const canAfford = Object.entries(costs).every(([type, amount]) => 
      inventory[type as ResourceType] >= (amount || 0)
    );
    if (canAfford) {
      setInventory(prev => {
        const next = { ...prev };
        Object.entries(costs).forEach(([type, amount]) => {
          if (amount) next[type as ResourceType] -= amount;
        });
        return next;
      });
      setUpgrades(prev => ({ ...prev, luckLevel: (prev.luckLevel || 0) + 1 }));
    }
  };

  const buyCardsUpgrade = () => {
    const currentLevel = upgrades.maxCardsLevel || 0;
    if (currentLevel >= MAX_CARDS_LEVEL) return;
    const costs = getCardsUpgradeCost(currentLevel);
    const canAfford = Object.entries(costs).every(([type, amount]) => 
      inventory[type as ResourceType] >= (amount || 0)
    );
    if (canAfford) {
      setInventory(prev => {
        const next = { ...prev };
        Object.entries(costs).forEach(([type, amount]) => {
          if (amount) next[type as ResourceType] -= amount;
        });
        return next;
      });
      setUpgrades(prev => ({ ...prev, maxCardsLevel: (prev.maxCardsLevel || 0) + 1 }));
    }
  };

  const currentLuckCosts = getLuckUpgradeCost(upgrades.luckLevel || 0);
  const currentCardsCosts = getCardsUpgradeCost(upgrades.maxCardsLevel || 0);
  
  const isMaxLuck = (upgrades.luckLevel || 0) >= MAX_LUCK_LEVEL;
  const isMaxCards = (upgrades.maxCardsLevel || 0) >= MAX_CARDS_LEVEL;

  return (
    <div className="min-h-screen flex flex-col relative overflow-y-auto">
      <InventoryDisplay inventory={inventory} />

      <main className="flex-1 flex flex-col items-center pt-8 pb-16 px-4 ml-24 md:ml-32 z-10">
        
        {/* Title and Cards Section */}
        <div className="w-full flex flex-col items-center mb-8">
          <div className="text-center pointer-events-none mb-4">
            <h1 className="text-3xl md:text-5xl font-fantasy font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f5df9f] via-[#c0a060] to-[#8d6e3e] drop-shadow-xl">
              CARD BONANZA
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#c0a060] to-transparent mx-auto mt-1 opacity-40"></div>
          </div>

          <div 
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 relative py-2 w-full max-w-5xl"
          >
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center justify-center p-1"
              >
                <Card
                  card={card}
                  isFlipped={selectedId !== null}
                  isHidden={isResetting}
                  isChosen={selectedId === card.id}
                  isDimmed={selectedId !== null && selectedId !== card.id}
                  onFlip={handleCardFlip}
                  disabled={selectedId !== null || isResetting}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Compact Shop Section with two columns */}
        <div className="w-full max-w-xl px-4">
          <div className="bg-[#2d1e14]/95 border-2 border-[#c0a060]/40 rounded-2xl p-4 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Luck Upgrade */}
              <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-[#c0a060]/20 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center justify-between w-full mb-2">
                  <h2 className="text-[10px] font-fantasy font-black text-[#f5df9f] uppercase tracking-wider">
                    Luck
                  </h2>
                  <span className="text-[#c0a060] font-black text-[9px] uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded border border-[#c0a060]/20">
                    LVL {upgrades.luckLevel || 0}
                  </span>
                </div>
                <div className="w-full bg-black/30 border border-[#c0a060]/10 rounded-xl p-2.5 flex flex-col items-center">
                  {!isMaxLuck ? (
                    <div className="w-full mb-2">
                      {Object.entries(currentLuckCosts).map(([type, amount]) => {
                        const res = RESOURCE_CONFIG[type as ResourceType];
                        const hasEnough = inventory[type as ResourceType] >= (amount || 0);
                        return (
                          <div key={type} className="flex items-center justify-between text-[10px]">
                            <span className={`flex items-center gap-1 ${res.color} font-bold opacity-80 uppercase`}>
                              {React.cloneElement(res.icon as React.ReactElement<{ className?: string }>, { className: "w-3 h-3" })}
                              Gold
                            </span>
                            <span className={`font-black ${hasEnough ? 'text-white' : 'text-red-500'}`}>
                              {amount?.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mb-2 text-amber-400 font-black uppercase text-[8px]">MAXED</div>
                  )}
                  <button
                    disabled={isMaxLuck}
                    onClick={buyLuckUpgrade}
                    className={`w-full py-1.5 rounded-lg font-black uppercase text-[9px] transition-all
                      ${isMaxLuck ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-b from-[#f5df9f] to-[#c0a060] text-black hover:scale-[1.02] shadow-sm'}`}
                  >
                    Upgrade Luck
                  </button>
                </div>
              </div>

              {/* Slots Upgrade */}
              <div className="flex flex-col items-center pt-0">
                <div className="flex items-center justify-between w-full mb-2">
                  <h2 className="text-[10px] font-fantasy font-black text-[#f5df9f] uppercase tracking-wider">
                    Slots
                  </h2>
                  <span className="text-[#c0a060] font-black text-[9px] uppercase tracking-tighter bg-black/40 px-1.5 py-0.5 rounded border border-[#c0a060]/20">
                    {(upgrades.maxCardsLevel || 0) + 1}/4
                  </span>
                </div>
                <div className="w-full bg-black/30 border border-[#c0a060]/10 rounded-xl p-2.5 flex flex-col items-center">
                  {!isMaxCards ? (
                    <div className="w-full mb-2">
                      {Object.entries(currentCardsCosts).map(([type, amount]) => {
                        const res = RESOURCE_CONFIG[type as ResourceType];
                        const hasEnough = inventory[type as ResourceType] >= (amount || 0);
                        return (
                          <div key={type} className="flex items-center justify-between text-[10px]">
                            <span className={`flex items-center gap-1 ${res.color} font-bold opacity-80 uppercase`}>
                              {React.cloneElement(res.icon as React.ReactElement<{ className?: string }>, { className: "w-3 h-3" })}
                              Materials
                            </span>
                            <span className={`font-black ${hasEnough ? 'text-white' : 'text-red-500'}`}>
                              {amount?.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mb-2 text-amber-400 font-black uppercase text-[8px]">MAXED</div>
                  )}
                  <button
                    disabled={isMaxCards}
                    onClick={buyCardsUpgrade}
                    className={`w-full py-1.5 rounded-lg font-black uppercase text-[9px] transition-all
                      ${isMaxCards ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-gradient-to-b from-[#10b981] to-[#059669] text-white hover:scale-[1.02] shadow-sm'}`}
                  >
                    Add Slot
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-[#c0a060]/40 text-[7px] mt-2 uppercase font-bold tracking-tighter text-center w-full">
              Luck improves rarity. Slots increase card quantity.
            </p>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-orange-900/10 rounded-full blur-[160px] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>
    </div>
  );
};

export default App;