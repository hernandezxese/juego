/**
 * Save & Load Modal with 3 Slots
 * Bárbara: Crónicas Elementales del Sur
 */

import React, { useState, useEffect } from 'react';
import { storageService, SlotSummary } from '../services/storageService';
import { sound } from '../services/audioService';
import { RegionId } from '../types/game';
import { Save, FolderOpen, Trash2, X, CheckCircle2, AlertCircle, Compass, Sparkles } from 'lucide-react';

interface SaveLoadModalProps {
  mode: 'save' | 'load' | 'manage';
  onSaveSlot: (slotId: number) => void;
  onLoadSlot: (slotId: number) => void;
  onClose: () => void;
}

const REGION_NAMES: Record<RegionId, string> = {
  santiago: 'Santiago & Cerro San Cristóbal',
  pucon: 'Pucón & Lago Villarrica',
  villarrica: 'Volcán Villarrica & Cuevas de Lava',
  hornopiren: 'Carretera Austral & Fiordos Hornopirén',
};

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  mode,
  onSaveSlot,
  onLoadSlot,
  onClose,
}) => {
  const [slots, setSlots] = useState<(SlotSummary | null)[]>([]);
  const [confirmDeleteSlot, setConfirmDeleteSlot] = useState<number | null>(null);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const refreshSlots = () => {
    setSlots(storageService.getAllSlots());
  };

  useEffect(() => {
    refreshSlots();
  }, []);

  const handleSave = (slotId: number) => {
    sound.playConfirm();
    onSaveSlot(slotId);
    refreshSlots();
    setActiveMessage(`¡Partida guardada exitosamente en la Ranura ${slotId}!`);
    setTimeout(() => setActiveMessage(null), 3000);
  };

  const handleLoad = (slotId: number) => {
    sound.playConfirm();
    onLoadSlot(slotId);
  };

  const handleDelete = (slotId: number) => {
    sound.playCancel();
    storageService.deleteSlot(slotId);
    setConfirmDeleteSlot(null);
    refreshSlots();
    setActiveMessage(`Ranura ${slotId} eliminada.`);
    setTimeout(() => setActiveMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-2xl p-5 sm:p-6 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-silkscreen text-sm sm:text-base text-emerald-300">
                SISTEMA DE PARTIDAS (3 RANURAS)
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                Guarda, carga o administra tus archivos de aventura
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback message banner */}
        {activeMessage && (
          <div className="mb-3 p-2.5 bg-emerald-950/80 border border-emerald-400 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{activeMessage}</span>
          </div>
        )}

        {/* 3 Slots List */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {[1, 2, 3].map(slotId => {
            const slot = slots[slotId - 1];
            const isFilled = slot !== null;

            return (
              <div
                key={slotId}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  isFilled
                    ? 'bg-slate-950/70 border-slate-700 hover:border-emerald-500/70'
                    : 'bg-slate-950/40 border-dashed border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Slot Header info */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-silkscreen text-xs text-amber-300 font-bold flex-shrink-0">
                      #{slotId}
                    </div>

                    <div>
                      {isFilled ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-silkscreen text-xs text-white">
                              {slot.leaderSpiritIcon} {slot.leaderSpiritName}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                              Nv. {slot.barbaraLevel}
                            </span>
                            <span className="text-[10px] font-mono text-amber-300">
                              💰 {slot.gold}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-300 mt-0.5 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-cyan-400" />
                            <span>{REGION_NAMES[slot.regionId] || slot.regionId}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-1">
                            Guardado: {new Date(slot.savedAt).toLocaleString()} &middot; {slot.spiritCount} espíritus
                          </div>
                        </>
                      ) : (
                        <div className="py-1">
                          <span className="font-silkscreen text-xs text-slate-500 italic">
                            [ Ranura {slotId} Vacía ]
                          </span>
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">
                            Disponible para guardar tu aventura actual.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions for this slot */}
                  <div className="flex items-center gap-2 justify-end">
                    {/* Guardar button */}
                    <button
                      onClick={() => handleSave(slotId)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950 transition-colors"
                      title={`Guardar partida actual en Ranura ${slotId}`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>

                    {/* Cargar button (if slot filled) */}
                    {isFilled && (
                      <button
                        onClick={() => handleLoad(slotId)}
                        className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-950 transition-colors"
                        title={`Cargar datos de Ranura ${slotId}`}
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Cargar</span>
                      </button>
                    )}

                    {/* Borrar button (if slot filled) */}
                    {isFilled && (
                      <>
                        {confirmDeleteSlot === slotId ? (
                          <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500">
                            <button
                              onClick={() => handleDelete(slotId)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-mono text-[10px] font-bold cursor-pointer"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setConfirmDeleteSlot(null)}
                              className="px-1.5 py-1 text-slate-400 hover:text-white font-mono text-[10px] cursor-pointer"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteSlot(slotId)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                            title="Borrar ranura"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-mono text-xs font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
