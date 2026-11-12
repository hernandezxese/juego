/**
 * Botica y Puesto de Provisiones Ancestral
 * Permite comprar y vender pociones de salud (Matico), pociones de Maná (Gota Termal), revivir (Empanadas) y Orbes de Resonancia.
 */

import React, { useState } from 'react';
import { InventoryItem, BarbaraHero } from '../types/game';
import { INITIAL_ITEMS } from '../data/itemsData';
import { sound } from '../services/audioService';
import { 
  Store, 
  ChevronLeft, 
  Coins, 
  Heart, 
  Droplet, 
  Sparkles, 
  Crosshair, 
  ShoppingBag, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface ShopModalProps {
  barbara: BarbaraHero;
  inventory: Record<string, InventoryItem>;
  onBuyItem: (itemId: string, quantity: number, totalCost: number) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  barbara,
  inventory,
  onBuyItem,
  onClose,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('matico');
  const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);

  // Shop Catalog (healing, mana, revive, resonance orbs, and rare catalyst essences)
  const shopCatalog = [
    {
      id: 'matico',
      name: 'Hojas de Matico',
      category: 'Salud',
      description: 'Poción de hierba medicinal chilena. Restaura 80 PS al instante.',
      icon: '🍃',
      price: 35,
      typeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40'
    },
    {
      id: 'gota_termal',
      name: 'Gota Termal de Pucón',
      category: 'Maná (PM)',
      description: 'Agua mineral caliente con sales termales. Restaura 50 PM de energía táctica.',
      icon: '💧',
      price: 45,
      typeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40'
    },
    {
      id: 'empanada',
      name: 'Empanada de Horno',
      category: 'Revivir',
      description: 'Nutritivo banquete tradicional. Revive a un aliado caído con 50% de PS.',
      icon: '🥟',
      price: 90,
      typeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40'
    },
    {
      id: 'infusion_calafate',
      name: 'Infusión de Calafate',
      category: 'Cura Total',
      description: 'Brebaje de bayas silvestres. Restaura 150 PS y sana estados de quemadura o congelamiento.',
      icon: '🫐',
      price: 65,
      typeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40'
    },
    {
      id: 'orbe_resonancia',
      name: 'Orbe de Resonancia Pewén',
      category: 'Captura',
      description: 'Esfera tallada en madera fósil andina para sintonizar y reclutar monstruos.',
      icon: '🔮',
      price: 50,
      typeColor: 'text-sky-400 border-sky-500/40 bg-sky-950/40'
    },
    {
      id: 'esencia_pewen',
      name: 'Resina de Pewén',
      category: 'Evolución',
      description: 'Catalizador para evolucionar espíritus de Planta/Tierra en el Santuario.',
      icon: '🌿',
      price: 180,
      typeColor: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40'
    },
    {
      id: 'corazon_basalto',
      name: 'Corazón de Basalto',
      category: 'Evolución',
      description: 'Piedra volcánica que despierta las evoluciones de Fuego.',
      icon: '🔥',
      price: 180,
      typeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/40'
    },
    {
      id: 'cristal_hielo',
      name: 'Cristal de Hielo Azul',
      category: 'Evolución',
      description: 'Gema tallada en ventisqueros para evoluciones de Hielo y Austral.',
      icon: '❄️',
      price: 180,
      typeColor: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40'
    }
  ];

  const selectedItem = shopCatalog.find(i => i.id === selectedItemId) || shopCatalog[0];
  const currentCount = inventory[selectedItem.id]?.count || 0;
  const canAfford1 = barbara.gold >= selectedItem.price;
  const canAfford3 = barbara.gold >= selectedItem.price * 3;

  const handleBuy = (qty: number) => {
    const totalCost = selectedItem.price * qty;
    if (barbara.gold < totalCost) {
      sound.playCancel();
      return;
    }
    sound.playConfirm();
    onBuyItem(selectedItem.id, qty, totalCost);
    setPurchaseSuccessMessage(`¡Compraste ${qty}x ${selectedItem.name}!`);
    setTimeout(() => setPurchaseSuccessMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none p-4 md:p-6 text-white font-ui animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-silkscreen"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>SALIR DE LA BOTICA [ESC]</span>
          </button>
          <div>
            <h2 className="font-silkscreen text-sm md:text-base text-amber-400 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              BOTICA & ALMACÉN DEL EXPEDICIONARIO
            </h2>
            <p className="text-xs text-slate-400 font-mono-stat">Compra pociones curativas, maná revitalizante, comidas de revivir y orbes</p>
          </div>
        </div>

        {/* Barbara Gold Wallet */}
        <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-amber-500/50 rounded-2xl shadow-lg">
          <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-mono-stat text-slate-400 leading-tight">Oro disponible</span>
            <span className="font-silkscreen text-xs text-amber-300 font-bold">{barbara.gold} Monedas</span>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="max-w-5xl w-full mx-auto my-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Item List */}
        <div className="lg:col-span-7 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 flex flex-col gap-2 max-h-[500px] overflow-y-auto shadow-2xl">
          <div className="text-[11px] font-silkscreen text-slate-400 mb-1 px-2 flex justify-between">
            <span>PROVISIÓN DISPONIBLE</span>
            <span>PRECIO UNITARIO</span>
          </div>

          {shopCatalog.map(item => {
            const isSelected = item.id === selectedItemId;
            const inBag = inventory[item.id]?.count || 0;
            const affordable = barbara.gold >= item.price;

            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedItemId(item.id);
                }}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-950/60 border-amber-400 shadow-lg ring-1 ring-amber-400' 
                    : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 bg-slate-900 border border-slate-800 rounded-xl">{item.icon}</span>
                  <div>
                    <div className="font-silkscreen text-xs text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono-stat border ${item.typeColor}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono-stat mt-0.5">
                      En mochila: <span className="text-emerald-400 font-bold">{inBag}</span> unidades
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-silkscreen text-xs">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className={affordable ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                    {item.price}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Item Purchase Terminal */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-xl flex-1">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="text-4xl p-3 bg-slate-950 border border-slate-800 rounded-2xl shadow-inner">
                {selectedItem.icon}
              </span>
              <div>
                <h3 className="font-silkscreen text-sm text-white">{selectedItem.name}</h3>
                <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-mono-stat border ${selectedItem.typeColor}`}>
                  {selectedItem.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-ui bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              {selectedItem.description}
            </p>

            {purchaseSuccessMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-xs font-silkscreen text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{purchaseSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between items-center text-xs font-mono-stat text-slate-400">
                <span>Tienes en la mochila:</span>
                <span className="text-white font-bold">{currentCount} unidades</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono-stat text-slate-400">
                <span>Tu saldo actual:</span>
                <span className="text-amber-300 font-bold">{barbara.gold} Monedas</span>
              </div>
            </div>

            {/* Buy Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={!canAfford1}
                onClick={() => handleBuy(1)}
                className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-silkscreen text-xs rounded-2xl cursor-pointer transition-all shadow-lg shadow-emerald-950 flex flex-col items-center justify-center gap-1 border border-emerald-400/40"
              >
                <span>COMPRAR 1x</span>
                <span className="text-[10px] font-mono-stat text-amber-300 font-bold">({selectedItem.price} Oro)</span>
              </button>

              <button
                disabled={!canAfford3}
                onClick={() => handleBuy(3)}
                className="py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-silkscreen text-xs rounded-2xl cursor-pointer transition-all shadow-lg shadow-cyan-950 flex flex-col items-center justify-center gap-1 border border-cyan-400/40"
              >
                <span>COMPRAR 3x</span>
                <span className="text-[10px] font-mono-stat text-amber-300 font-bold">({selectedItem.price * 3} Oro)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono-stat text-slate-500">
        Monedas de oro obtenidas al vencer criaturas silvestres o guardianes ancestrales en combate.
      </div>
    </div>
  );
};
