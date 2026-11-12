/**
 * Bestiario / Pokédex de la Naturaleza de Chile
 * Registra todos los espíritus de la fauna y flora nativa, sus líneas evolutivas, elementos y hábitats.
 */

import React, { useState } from 'react';
import { SpiritCreature, ElementType } from '../types/game';
import { SPIRITS_REGISTRY, SpiritTemplate } from '../data/spiritsData';
import { drawCreatureSprite } from '../utils/pixelRenderer';
import { sound } from '../services/audioService';
import { 
  BookOpen, 
  ChevronLeft, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Droplets, 
  Mountain, 
  Wind, 
  Eye, 
  Lock 
} from 'lucide-react';

interface BestiaryModalProps {
  partySpirits: SpiritCreature[];
  onClose: () => void;
}

export const BestiaryModal: React.FC<BestiaryModalProps> = ({
  partySpirits,
  onClose,
}) => {
  const [selectedBaseId, setSelectedBaseId] = useState<string>('brotin');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const [filterElement, setFilterElement] = useState<ElementType | 'all'>('all');

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Set of baseIds ever encountered/owned by the player
  const capturedBaseIds = new Set(partySpirits.map(s => s.baseId));

  const allEntries: SpiritTemplate[] = Object.values(SPIRITS_REGISTRY);

  const filteredEntries = allEntries.filter(entry => {
    if (filterElement === 'all') return true;
    return entry.primaryElement === filterElement || entry.secondaryElement === filterElement;
  });

  const selectedTemplate = SPIRITS_REGISTRY[selectedBaseId] || allEntries[0];
  const isCaptured = capturedBaseIds.has(selectedBaseId);
  const currentStage = selectedTemplate.evolutionLine[selectedStageIndex] || selectedTemplate.evolutionLine[0];

  // Render animated sprite
  React.useEffect(() => {
    let animId: number;
    let t = 0;
    const render = () => {
      t += 0.05;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 180, 180);
          drawCreatureSprite(
            ctx, 
            selectedTemplate.baseId, 
            currentStage.stage, 
            10, 
            10, 
            160, 
            t, 
            false
          );
        }
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedTemplate.baseId, currentStage.stage]);

  const getElementBadge = (el: ElementType) => {
    const colors: Record<ElementType, string> = {
      fuego: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      agua: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      planta: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      viento: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
      tierra: 'bg-amber-600/20 text-amber-400 border-amber-600/40',
      hielo: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      sagrado: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      normal: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-silkscreen uppercase border ${colors[el] || 'bg-slate-700 text-white'}`}>
        {el}
      </span>
    );
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
            <span>VOLVER [ESC]</span>
          </button>
          <div>
            <h2 className="font-silkscreen text-sm md:text-base text-cyan-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              BESTIARIO & GUÍA DE ESPÍRITUS (POKÉDEX)
            </h2>
            <p className="text-xs text-slate-400 font-mono-stat">Catálogo de especies elementales y evoluciones de la naturaleza chilena</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-2xl text-xs font-mono-stat text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Sintonizados: <strong className="text-emerald-300">{capturedBaseIds.size} / {allEntries.length}</strong></span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto my-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Spirit Grid */}
        <div className="lg:col-span-5 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-4 flex flex-col gap-3 shadow-2xl">
          {/* Element Filter Tags */}
          <div className="flex flex-wrap gap-1 pb-2 border-b border-slate-800">
            {(['all', 'planta', 'fuego', 'agua', 'viento', 'tierra', 'hielo'] as const).map(el => (
              <button
                key={el}
                onClick={() => {
                  sound.playSelect();
                  setFilterElement(el);
                }}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-silkscreen uppercase transition-all cursor-pointer ${
                  filterElement === el
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {el === 'all' ? 'Todos' : el}
              </button>
            ))}
          </div>

          {/* Spirit list */}
          <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredEntries.map((entry, idx) => {
              const isSelected = entry.baseId === selectedBaseId;
              const captured = capturedBaseIds.has(entry.baseId);

              return (
                <button
                  key={entry.baseId}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedBaseId(entry.baseId);
                    setSelectedStageIndex(0);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-lg ring-1 ring-cyan-400' 
                      : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-silkscreen text-xs text-slate-500 w-6">#{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-xl p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
                      {entry.evolutionLine[0]?.icon || '✨'}
                    </span>
                    <div>
                      <div className="font-silkscreen text-xs text-white flex items-center gap-1.5">
                        <span>{entry.defaultName}</span>
                        {captured && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono-stat mt-0.5">
                        Evolución: {entry.evolutionLine.length} Etapas &middot; {entry.primaryElement}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono-stat uppercase border ${
                    captured ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}>
                    {captured ? 'RECLUTADO' : 'AVISTADO'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Dex Entry */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-xl flex-1">
            {/* Top row: Stage selector & Name */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-silkscreen text-base text-white flex items-center gap-2">
                  <span>{currentStage.name}</span>
                  <span className="text-xs text-amber-400 font-mono-stat">({currentStage.title})</span>
                </h3>
                {selectedTemplate.scientificName && (
                  <div className="text-xs font-mono italic text-emerald-400 mt-0.5">
                    {selectedTemplate.scientificName}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {getElementBadge(selectedTemplate.primaryElement)}
                  {selectedTemplate.secondaryElement && getElementBadge(selectedTemplate.secondaryElement)}
                  <span className="text-[10px] font-mono-stat text-slate-400 uppercase">
                    Rareza: <strong className="text-amber-300">{selectedTemplate.rarity}</strong>
                  </span>
                </div>
              </div>

              {/* Evolution Stage Switcher Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                {selectedTemplate.evolutionLine.map((stage, idx) => (
                  <button
                    key={stage.stage}
                    onClick={() => {
                      sound.playSelect();
                      setSelectedStageIndex(idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-silkscreen transition-all cursor-pointer ${
                      selectedStageIndex === idx
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Etapa {stage.stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprite Display & Lore */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Animated Canvas */}
              <div className="sm:col-span-5 bg-slate-950/90 border border-slate-800 rounded-3xl p-3 flex flex-col items-center justify-center relative shadow-inner">
                <canvas 
                  ref={canvasRef} 
                  width={180} 
                  height={180} 
                  className="w-36 h-36 object-contain image-render-pixel" 
                />
                <span className="text-[10px] font-mono-stat text-slate-400 mt-1">
                  Modelo Pixel-Art Etapa {currentStage.stage}
                </span>
              </div>

              {/* Stats & Lore Box */}
              <div className="sm:col-span-7 flex flex-col gap-2">
                <p className="text-xs text-slate-300 leading-relaxed font-ui italic bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  "{currentStage.description || selectedTemplate.lore}"
                </p>

                {selectedTemplate.naturalHistory && (
                  <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] font-ui text-emerald-200/90 leading-relaxed">
                    <span className="font-silkscreen text-[9px] text-emerald-400 block mb-0.5 tracking-wider">
                      HISTORIA NATURAL & HÁBITAT CHILENO:
                    </span>
                    {selectedTemplate.naturalHistory}
                  </div>
                )}

                {/* Base Attribute Profile */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-stat">
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">PS Base:</span>
                    <span className="text-emerald-400 font-bold">{currentStage.baseHp}</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">PM Base:</span>
                    <span className="text-cyan-400 font-bold">{currentStage.baseMp}</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Ataque:</span>
                    <span className="text-amber-400 font-bold">{currentStage.baseAttack}</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Defensa:</span>
                    <span className="text-blue-400 font-bold">{currentStage.baseDefense}</span>
                  </div>
                </div>

                {/* Signature Skill */}
                <div className="p-2.5 bg-slate-950/90 border border-slate-800 rounded-2xl">
                  <div className="text-[10px] font-silkscreen text-cyan-300 mb-1 flex items-center justify-between">
                    <span>TÉCNICA EMBLEMÁTICA:</span>
                    <span>{currentStage.signatureSkill.mpCost} PM</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{currentStage.signatureSkill.name}</div>
                  <div className="text-[11px] text-slate-400 font-ui mt-0.5">{currentStage.signatureSkill.description}</div>
                </div>
              </div>
            </div>

            {/* Evolution requirement summary */}
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs font-mono-stat text-cyan-300 flex items-center justify-between">
              <span>Condición de evolución a Etapa {currentStage.stage}:</span>
              <strong className="text-white">
                {currentStage.stage === 1 
                  ? 'Forma inicial' 
                  : `Nivel ${currentStage.requiredLevel} + ${currentStage.requiredItem ? 'Objeto catalizador' : 'Entrenamiento'}`}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono-stat text-slate-500">
        Usa los Orbes de Resonancia Pewén en combate silvestre para sincronizar nuevas especies a tu equipo y completar el Bestiario.
      </div>
    </div>
  );
};
