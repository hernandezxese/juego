/**
 * Inventory Modal for Bárbara: Crónicas Elementales del Sur
 * Displays Chilean remedies, evolution catalysts, capture orbs, and allows item usage on party spirits
 */

import React, { useState } from 'react';
import { InventoryItem, SpiritCreature } from '../types/game';
import { sound } from '../services/audioService';
import { Backpack, ChevronLeft, Sparkles, Heart } from 'lucide-react';

interface InventoryModalProps {
  inventory: Record<string, InventoryItem>;
  partySpirits: SpiritCreature[];
  onUseItemOnSpirit: (itemId: string, spiritUid: string) => void;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  inventory,
  partySpirits,
  onUseItemOnSpirit,
  onClose
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('matico');
  const [showTargetSelect, setShowTargetSelect] = useState(false);

  const itemsList = Object.values(inventory).filter(item => item.count > 0);
  const selectedItem = inventory[selectedItemId] || itemsList[0];

  const handleUseItemClick = () => {
    if (!selectedItem || selectedItem.count <= 0) return;
    if (selectedItem.category === 'curativo') {
      sound.playSelect();
      setShowTargetSelect(true);
    } else {
      sound.playSelect();
    }
  };

  const handleApplyToSpirit = (spiritUid: string) => {
    sound.playHeal();
    onUseItemOnSpirit(selectedItem.id, spiritUid);
    setShowTargetSelect(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none p-4 md:p-6 text-white">
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <div>
            <h2 className="font-pixel text-sm md:text-base text-amber-400 flex items-center gap-2">
              <Backpack className="w-4 h-4 text-amber-400" />
              MOCHILA DE EXPEDICIÓN
            </h2>
            <p className="text-xs text-slate-400 font-mono">Remedios tradicionales chilenos, orbes y catalizadores de evolución</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full mx-auto my-6 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Items list */}
        <div className="md:col-span-7 flex flex-col gap-2">
          <span className="font-pixel text-[11px] text-slate-400 mb-1">OBJETOS DISPONIBLES:</span>
          {itemsList.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500 font-mono text-xs">
              Tu mochila está vacía. Abre cofres en las regiones para conseguir hierbas y esencias.
            </div>
          ) : (
            itemsList.map((item) => {
              const isSelected = item.id === selectedItem?.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedItemId(item.id);
                    setShowTargetSelect(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-950/70 border-amber-500 shadow-md shadow-amber-950' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="font-pixel text-xs text-white block">{item.name}</span>
                      <span className="text-[11px] font-mono text-slate-400 capitalize">{item.category}</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-amber-400 font-bold bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                    x{item.count}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Selected Item Details & Usage */}
        {selectedItem && (
          <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-center p-4 bg-slate-950/60 rounded-xl border border-slate-800 mb-4">
                <span className="text-4xl block mb-2">{selectedItem.icon}</span>
                <h3 className="font-pixel text-sm text-white">{selectedItem.name}</h3>
                <span className="text-[11px] font-mono text-amber-400 block mt-1">Cantidad: {selectedItem.count}</span>
              </div>

              <p className="text-xs text-slate-300 font-mono leading-relaxed mb-4">
                {selectedItem.description}
              </p>

              {/* Target selection if using healing item */}
              {showTargetSelect ? (
                <div className="space-y-2 mb-4 animate-in fade-in duration-150">
                  <span className="font-pixel text-[10px] text-emerald-400 block mb-1">ELIGE A QUIÉN APLICAR:</span>
                  {partySpirits.map((spirit) => (
                    <button
                      key={spirit.uid}
                      onClick={() => handleApplyToSpirit(spirit.uid)}
                      className="w-full p-2.5 bg-slate-950 hover:bg-emerald-950 border border-slate-800 hover:border-emerald-500 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-pixel text-[11px] text-white">{spirit.name}</span>
                      <span className="font-mono text-xs text-emerald-400">
                        {spirit.currentHp}/{spirit.maxHp} PS
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowTargetSelect(false)}
                    className="w-full py-1.5 text-slate-500 hover:text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : selectedItem.category === 'curativo' ? (
                <button
                  onClick={handleUseItemClick}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-pixel text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 text-emerald-200" />
                  <span>USAR EN UN ESPÍRITU</span>
                </button>
              ) : selectedItem.category === 'esencia' ? (
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-xs font-mono text-amber-300">
                  Lleva este catalizador al <span className="font-bold">Santuario de Evolución</span> para despertar a tus espíritus.
                </div>
              ) : (
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-xs font-mono text-sky-300">
                  Se usa directamente en combate mediante el comando <span className="font-bold">Sintonizar</span>.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
        Encuentra más remedios medicinales y esencias explorando las 4 regiones de Chile.
      </div>
    </div>
  );
};
