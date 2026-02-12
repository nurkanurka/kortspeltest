
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardState, Inventory, ResourceType, UpgradesState, Rarity } from './types';
import { generateNewCards, getUpgradeCost, MAX_LEVEL } from './utils/gameLogic';
import Card from './components/Card';
import InventoryDisplay from './components/InventoryDisplay';
import { RARITY_CONFIG, RESOURCE_CONFIG } from './constants';

const App: React.FC = () => {
  const [cards, setCards] = useState<CardState[]>([]);
  const [inventory, setInventory] = useState<Inventory>(() => {
    const saved = localStorage.getItem('tavern-inventory');
    return saved ? JSON.parse(saved) : {
      [ResourceType.GOLD]: 0,
      [ResourceType.ENERGY]: 0,
      [ResourceType.MATERIALS]: 0,
    };
  });
  
  const [upgrades, setUpgrades] = useState<UpgradesState>(() => {
    const saved = localStorage.getItem('tavern-upgrades');
    return saved ? JSON.parse(saved) : {
      uncommonLevel: 0,
      rareLevel: 0,
      ultraRareLevel: 0,
    };
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [centerOffsets, setCenterOffsets] = useState<{ [key: string]: { x: number; y: number } }>({});

  // Persistence
  useEffect(() => {
    localStorage.setItem('tavern-inventory', JSON.stringify(inventory));
    localStorage.setItem('tavern-upgrades', JSON.stringify(upgrades));
  }, [inventory, upgrades]);

  // Initialize cards on mount
  useEffect(() => {
    setCards(generateNewCards(upgrades));
  }, [upgrades]);

  const calculateOffsets = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const newOffsets: { [key: string]: { x: number; y: number } } = {};
    
    cards.forEach((card) => {
      const el = cardRefs.current[card.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        const cardCenterX = rect.left - containerRect.left + rect.width / 2;
        const cardCenterY = rect.top - containerRect.top + rect.height / 2;
        
        newOffsets[card.id] = {
          x: centerX - cardCenterX,
          y: centerY - cardCenterY
        };
      }
    });
    setCenterOffsets(newOffsets);
  }, [cards]);

  useEffect(() => {
    const timer = setTimeout(calculateOffsets, 100);
    window.addEventListener('resize', calculateOffsets);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateOffsets);
    };
  }, [calculateOffsets]);

  const handleCardFlip = useCallback((id: string) => {
    if (selectedId || isResetting || isShopOpen) return;

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
    }, 2200);
  }, [cards, selectedId, isResetting, isShopOpen, upgrades]);

  const buyUpgrade = (rarity: Rarity) => {
    const levelKey = rarity === Rarity.UNCOMMON ? 'uncommonLevel' : 
                    rarity === Rarity.RARE ? 'rareLevel' : 'ultraRareLevel';
    const currentLevel = upgrades[levelKey];
    
    if (currentLevel >= MAX_LEVEL) return;

    const costs = getUpgradeCost(rarity, currentLevel);
    
    const canAfford = Object.entries(costs).every(([type, amount]) => 
      inventory[type as ResourceType] >= (amount || 0)
    );

    if (canAfford) {
      setInventory(prev => {
        const next = { ...prev };
        Object.entries(costs).forEach(([type, amount]) => {
          next[type as ResourceType] -= (amount || 0);
        });
        return next;
      });

      setUpgrades(prev => ({
        ...prev,
        [levelKey]: prev[levelKey] + 1
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <InventoryDisplay inventory={inventory} />

      <main className="flex-1 flex flex-col items-center justify-center relative px-4 z-10 transition-all duration-500">
        <div className={`transition-all duration-500 flex flex-col items-center ${isShopOpen ? 'opacity-20 scale-90 blur-sm pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="text-center pointer-events-none mb-8">
            <h1 className="text-4xl md:text-6xl font-fantasy font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#f5df9f] via-[#c0a060] to-[#8d6e3e] drop-shadow-2xl">
              TAVERN GAMBIT
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#c0a060] to-transparent mx-auto mt-2 opacity-50"></div>
          </div>

          <div 
            ref={containerRef}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-16 relative py-12 w-full max-w-5xl"
          >
            {cards.map((card) => (
              <div 
                key={card.id} 
                ref={el => { cardRefs.current[card.id] = el; }}
                className="flex items-center justify-center"
              >
                <Card
                  card={card}
                  isFlipped={selectedId === card.id}
                  isHidden={(selectedId !== null && selectedId !== card.id) || isResetting}
                  isChosen={selectedId === card.id}
                  onFlip={handleCardFlip}
                  disabled={selectedId !== null || isResetting || isShopOpen}
                  offsetToCenter={centerOffsets[card.id]}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shop Button */}
        <button 
          onClick={() => setIsShopOpen(!isShopOpen)}
          className={`
            fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[#3d2b1f] border-2 border-[#c0a060] text-[#c0a060] shadow-2xl transition-all hover:scale-110 active:scale-95
            ${isShopOpen ? 'bg-[#c0a060] text-black border-white' : ''}
          `}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
             <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 8v11c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-2 2H4v7h14v-7z"/>
          </svg>
        </button>

        {/* Shop Overlay */}
        <div className={`
          fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500 p-6
          ${isShopOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-10'}
        `}>
          <div className="bg-[#2d1e14] border-4 border-[#c0a060] rounded-3xl p-8 max-w-3xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
            
            <button 
              onClick={() => setIsShopOpen(false)}
              className="absolute top-4 right-4 text-[#c0a060] hover:text-white transition-colors p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
              </svg>
            </button>

            <h2 className="text-4xl font-fantasy font-black text-[#f5df9f] text-center mb-8 uppercase tracking-widest text-shadow-fantasy">
              Tavern Upgrades
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[Rarity.UNCOMMON, Rarity.RARE, Rarity.ULTRA_RARE].map(rarity => {
                const levelKey = rarity === Rarity.UNCOMMON ? 'uncommonLevel' : 
                                rarity === Rarity.RARE ? 'rareLevel' : 'ultraRareLevel';
                const level = upgrades[levelKey];
                const costs = getUpgradeCost(rarity, level);
                const rConfig = RARITY_CONFIG[rarity];
                const isMax = level >= MAX_LEVEL;

                return (
                  <div key={rarity} className="bg-black/40 border border-[#c0a060]/30 rounded-2xl p-6 flex flex-col items-center text-center group hover:border-[#c0a060] transition-colors">
                    <div className={`w-16 h-16 rounded-full border-2 ${rConfig.border} ${rConfig.gem} mb-4 shadow-lg flex items-center justify-center`}>
                       <span className="text-white font-fantasy text-xl">{level}</span>
                    </div>
                    <h3 className={`text-xl font-fantasy font-bold mb-2 ${rConfig.color}`}>{rarity.replace('_', ' ')} LUCK</h3>
                    <p className="text-[#c0a060]/70 text-xs mb-6 h-12">Increase your chances of finding {rarity.replace('_', ' ')} artifacts.</p>
                    
                    {!isMax ? (
                      <div className="w-full space-y-2 mb-6">
                        {Object.entries(costs).map(([type, amount]) => {
                          const res = RESOURCE_CONFIG[type as ResourceType];
                          const hasEnough = inventory[type as ResourceType] >= (amount || 0);
                          return (
                            <div key={type} className="flex items-center justify-between text-sm">
                              <span className={`flex items-center gap-1 ${res.color}`}>
                                {React.cloneElement(res.icon as React.ReactElement<{ className?: string }>, { className: "w-4 h-4" })}
                                {res.label}
                              </span>
                              <span className={`font-bold ${hasEnough ? 'text-white' : 'text-red-500'}`}>
                                {amount}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mb-6 py-2 px-4 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase tracking-widest text-xs">
                        MAX LEVEL
                      </div>
                    )}

                    <button
                      disabled={isMax}
                      onClick={() => buyUpgrade(rarity)}
                      className={`
                        w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all
                        ${isMax ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#c0a060] text-black hover:scale-105 active:scale-95 shadow-lg'}
                      `}
                    >
                      {isMax ? 'Mastered' : 'Upgrade'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center text-[#c0a060]/40 text-[10px] uppercase tracking-[0.3em]">
              The tavern keeper favors the wealthy...
            </div>
          </div>
        </div>

        {!isShopOpen && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full text-center px-6">
             <div className="inline-flex flex-col items-center space-y-1">
               <div className="w-12 h-1 bg-[#c0a060]/30 rounded-full"></div>
               <p className="text-[#c0a060]/60 text-[11px] font-bold tracking-widest uppercase italic">
                 Visit the shop to improve your fortunes
               </p>
             </div>
          </div>
        )}
      </main>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[120vw] h-[120vh] bg-orange-900/10 rounded-full blur-[160px] opacity-40"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[150px] animate-pulse"></div>
      </div>
    </div>
  );
};

export default App;
