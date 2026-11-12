/**
 * Chilean World Map & Fast Travel Modal
 * 1: Santiago -> 2: Pucón -> 3: Villarrica -> 4: Carretera Austral (Hornopirén)
 * Features an illustrated retro cartographic map of Chile with mountain ranges, Pacific ocean, landmarks, and route lines.
 */

import React, { useState } from 'react';
import { RegionId } from '../types/game';
import { REGIONS_DATA } from '../data/regionsData';
import { sound } from '../services/audioService';
import { 
  MapPin, 
  Compass, 
  ChevronLeft, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Droplets, 
  Mountain, 
  Sparkles,
  TreePine,
  Navigation,
  Wind,
  Layers
} from 'lucide-react';

interface WorldMapModalProps {
  currentRegionId: RegionId;
  unlockedRegions: RegionId[];
  onFastTravel: (targetRegionId: RegionId) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  currentRegionId,
  unlockedRegions,
  onFastTravel,
  onClose
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>(currentRegionId);
  const regionsList: RegionId[] = ['santiago', 'pucon', 'villarrica', 'hornopiren'];

  const getRegionIcon = (id: RegionId) => {
    if (id === 'santiago') return <Mountain className="w-4 h-4 text-emerald-400" />;
    if (id === 'pucon') return <Droplets className="w-4 h-4 text-sky-400" />;
    if (id === 'villarrica') return <Flame className="w-4 h-4 text-red-400" />;
    return <Sparkles className="w-4 h-4 text-cyan-400" />;
  };

  const selectedRegion = REGIONS_DATA[selectedRegionId];
  const isSelectedUnlocked = unlockedRegions.includes(selectedRegionId);
  const isSelectedCurrent = selectedRegionId === currentRegionId;

  // Visual coordinates for Chile map points (0% to 100% vertical along the narrow ribbon)
  const mapNodes: Record<RegionId, { top: string; left: string; landmark: string; climate: string }> = {
    santiago: { top: '18%', left: '46%', landmark: 'Cerro San Cristóbal & Valle Central', climate: 'Mediterráneo' },
    pucon: { top: '44%', left: '50%', landmark: 'Lago Villarrica & Selva Valdiviana', climate: 'Templado Lluvioso' },
    villarrica: { top: '65%', left: '52%', landmark: 'Cráter Ruka Pillán & Cavernas de Magma', climate: 'Volcánico Andino' },
    hornopiren: { top: '86%', left: '48%', landmark: 'Fiordos de Comau & Alerces Milenarios', climate: 'Glaciar Patagónico' },
  };

  const [viewMode, setViewMode] = useState<'cartography' | 'stage_terrain'>('cartography');
  const stageCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Render authentic stage terrain miniature matching selected stage tiles
  React.useEffect(() => {
    if (viewMode !== 'stage_terrain' || !stageCanvasRef.current) return;
    const canvas = stageCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reg = selectedRegion;
    const cols = reg.width;
    const rows = reg.height;
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = reg.tiles[y]?.[x] ?? 0;
        const px = x * cellW;
        const py = y * cellH;

        if (tile === 0) ctx.fillStyle = reg.id === 'villarrica' ? '#3f3f46' : '#15803d';
        else if (tile === 1) ctx.fillStyle = '#b45309';
        else if (tile === 2) ctx.fillStyle = '#0284c7';
        else if (tile === 3) ctx.fillStyle = reg.id === 'villarrica' ? '#1c1917' : '#334155';
        else if (tile === 4) ctx.fillStyle = '#064e3b';
        else if (tile === 5) ctx.fillStyle = '#dc2626';
        else if (tile === 6) ctx.fillStyle = '#bae6fd';
        else if (tile === 7) ctx.fillStyle = '#ca8a04';
        else ctx.fillStyle = '#0f172a';

        ctx.fillRect(px, py, cellW, cellH);
      }
    }

    // Render entity positions on the mini stage map
    reg.entities.forEach(ent => {
      if (ent.cleared) return;
      const ex = ent.x * cellW + cellW / 2;
      const ey = ent.y * cellH + cellH / 2;

      if (ent.type === 'boss') {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(4, cellW * 0.9), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (ent.type === 'wild_encounter') {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(3, cellW * 0.6), 0, Math.PI * 2);
        ctx.fill();
      } else if (ent.type === 'npc') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(3, cellW * 0.7), 0, Math.PI * 2);
        ctx.fill();
      } else if (ent.type === 'chest') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ex - cellW * 0.4, ey - cellH * 0.4, cellW * 0.8, cellH * 0.8);
      } else if (ent.type === 'obstacle') {
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(ex - cellW * 0.4, ey - cellH * 0.4, cellW * 0.8, cellH * 0.8);
      } else if (ent.type === 'portal') {
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(ex - cellW * 0.5, ey - cellH * 0.5, cellW, cellH);
      }
    });
  }, [viewMode, selectedRegionId, selectedRegion]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none p-4 md:p-6 text-white font-ui">
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
              <Compass className="w-4 h-4 text-cyan-400" />
              MAPA EXPEDICIONARIO DE CHILE
            </h2>
            <p className="text-xs text-slate-400 font-mono-stat">Ruta de exploración elemental de Bárbara y cartografía de cada etapa</p>
          </div>
        </div>

        {/* View Mode Switcher Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSelect();
              setViewMode(v => v === 'cartography' ? 'stage_terrain' : 'cartography');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-cyan-400/50 rounded-xl text-xs font-silkscreen text-cyan-300 flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === 'cartography' ? 'VER TOPOGRAFÍA DE ETAPA' : 'VER RUTA DE CHILE'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Visual & Regions */}
      <div className="max-w-5xl w-full mx-auto my-4 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Cartographic Illustrated Map Canvas OR Stage Terrain Miniature */}
        <div className="lg:col-span-6 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden shadow-2xl">
          {viewMode === 'stage_terrain' ? (
            // TOPOGRAPHICAL MINIATURE OF THE SELECTED STAGE
            <div className="relative w-full h-full flex flex-col items-center justify-between z-10">
              <div className="w-full flex justify-between items-center pb-2 border-b border-slate-800 text-xs font-silkscreen text-cyan-300">
                <span>LABERINTO & RELIEVE: {selectedRegion.name.toUpperCase()}</span>
                <span className="text-[10px] text-slate-400 font-mono-stat">{selectedRegion.width}x{selectedRegion.height} casillas</span>
              </div>

              <div className="relative my-auto p-2 bg-slate-950 border-2 border-slate-700 rounded-2xl shadow-inner flex items-center justify-center">
                <canvas 
                  ref={stageCanvasRef} 
                  width={312} 
                  height={240} 
                  className="rounded-lg object-contain image-render-pixel border border-slate-800"
                />
              </div>

              {/* Legend of terrain symbols */}
              <div className="w-full grid grid-cols-3 gap-1.5 text-[9px] font-mono-stat text-slate-400 pt-2 border-t border-slate-800">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-yellow-300" /> Jefe</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Espíritu Silvestre</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Guía NPC</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-xs" /> Cofre Tesoro</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-pink-500 rounded-xs" /> Obstáculo Elemental</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-purple-500 rounded-xs" /> Portal Sur</span>
              </div>
            </div>
          ) : (
            // CARTA DE CHILE WITH PACIFIC OCEAN & ANDES MOUNTAINS
            <>
              {/* Background Ocean & Andes Mountain Visuals */}
              <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-slate-900 to-amber-950/30 pointer-events-none" />
              
              {/* Pacific Ocean Label (West) */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] tracking-widest font-silkscreen text-sky-500/40 uppercase pointer-events-none">
                Océano Pacífico
              </div>

              {/* Andes Mountain Range Label (East) */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[10px] tracking-widest font-silkscreen text-amber-500/40 uppercase pointer-events-none">
                Cordillera de los Andes
              </div>

              {/* Illustrated Chile Land Ribbon (Long narrow spine) */}
              <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-28 bg-gradient-to-b from-emerald-900/30 via-teal-900/40 to-cyan-950/50 rounded-full border border-slate-700/60 pointer-events-none shadow-inner" />

              {/* Mountain Ridge line */}
              <div className="absolute inset-y-8 left-[58%] w-1 bg-amber-700/30 rounded-full border-r border-dashed border-amber-600/40 pointer-events-none" />

              {/* Connecting expedition route line */}
              <div className="absolute top-[20%] bottom-[16%] left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-cyan-400/50 pointer-events-none" />

              {/* Region Waypoints on the Map */}
              {regionsList.map((id, idx) => {
                const reg = REGIONS_DATA[id];
                const node = mapNodes[id];
                const isCurrent = id === currentRegionId;
                const isUnlocked = unlockedRegions.includes(id);
                const isSelected = id === selectedRegionId;

                return (
                  <div 
                    key={id}
                    style={{ top: node.top, left: node.left }}
                    onClick={() => {
                      sound.playSelect();
                      setSelectedRegionId(id);
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-200`}
                  >
                    {/* Node Pin Marker */}
                    <div className={`relative flex items-center justify-center rounded-2xl p-2 transition-all ${
                      isSelected ? 'scale-110 shadow-2xl ring-2 ring-cyan-400' : 'hover:scale-105'
                    } ${
                      isCurrent 
                        ? 'bg-amber-500 border-2 border-white text-slate-950 shadow-amber-500/50' 
                        : isUnlocked 
                        ? 'bg-slate-800 border-2 border-cyan-400 text-cyan-300 shadow-cyan-950' 
                        : 'bg-slate-950 border-2 border-slate-800 text-slate-600'
                    }`}>
                      {isCurrent ? (
                        <MapPin className="w-5 h-5 animate-bounce text-slate-950" />
                      ) : isUnlocked ? (
                        getRegionIcon(id)
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}

                      {/* Stage number bubble */}
                      <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-silkscreen text-[9px] font-bold ${
                        isCurrent ? 'bg-white text-amber-600 border border-amber-500' : 'bg-slate-900 border border-slate-700 text-slate-300'
                      }`}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* Region Label Tag */}
                    <div className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl whitespace-nowrap text-left border ${
                      isSelected 
                        ? 'bg-slate-900/95 border-cyan-400 text-cyan-300 shadow-lg' 
                        : isCurrent
                        ? 'bg-amber-950/90 border-amber-500/70 text-amber-200'
                        : isUnlocked
                        ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950/80 border-slate-900 text-slate-500'
                    }`}>
                      <div className="font-silkscreen text-[11px] font-bold flex items-center gap-1.5">
                        <span>{reg.name.split('&')[0].trim()}</span>
                        {isCurrent && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded">AQUÍ</span>}
                      </div>
                      <div className="text-[9px] font-mono-stat text-slate-400">
                        {node.climate}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Compass Rose at bottom corner */}
              <div className="absolute bottom-4 left-4 flex flex-col items-center pointer-events-none opacity-60">
                <span className="font-silkscreen text-[10px] text-cyan-400 mb-0.5">N</span>
                <div className="w-7 h-7 border border-slate-600 rounded-full flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-cyan-300 rotate-45" />
                </div>
                <span className="font-silkscreen text-[10px] text-slate-500 mt-0.5">S</span>
              </div>

              <div className="absolute bottom-4 right-4 text-[10px] font-mono-stat text-slate-500 pointer-events-none">
                Escala: 1 : 2.500.000
              </div>
            </>
          )}
        </div>

        {/* Right: Selected Region Detailed Card & Fast Travel */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-xl flex-1">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-slate-950 border border-slate-700 rounded-2xl shadow-inner">
                  {getRegionIcon(selectedRegionId)}
                </span>
                <div>
                  <h3 className="font-silkscreen text-base text-white">{selectedRegion.name}</h3>
                  <p className="text-xs text-amber-400 font-mono-stat">{selectedRegion.subtitle}</p>
                </div>
              </div>

              {isSelectedCurrent ? (
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-silkscreen text-amber-300 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> AQUÍ
                </span>
              ) : isSelectedUnlocked ? (
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-xs font-silkscreen text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ACCESIBLE
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-silkscreen text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> BLOQUEADO
                </span>
              )}
            </div>

            {/* Lore and Geography */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p className="italic font-ui">"{selectedRegion.lore}"</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-stat pt-2 border-t border-slate-800/80">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Hito Geográfico:</span>
                  <span className="text-white font-semibold">{mapNodes[selectedRegionId].landmark}</span>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Clima Elemental:</span>
                  <span className="text-cyan-300 font-semibold">{mapNodes[selectedRegionId].climate}</span>
                </div>
              </div>
            </div>

            {/* Wild Encounters Preview */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
              <div className="text-[10px] font-silkscreen text-slate-400 mb-2 uppercase flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-emerald-400" />
                <span>Fauna & Espíritus Autóctonos de la Zona:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedRegion.wildEncounterTable.map(enc => (
                  <span key={enc.spiritId} className="px-2 py-0.5 bg-slate-800/80 border border-slate-700 rounded-lg text-[10px] font-mono-stat text-slate-300 capitalize">
                    {enc.spiritId} (Nv.{enc.minLevel === enc.maxLevel ? enc.minLevel : `${enc.minLevel}-${enc.maxLevel}`})
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button: Travel */}
            <div className="mt-auto pt-2">
              {isSelectedCurrent ? (
                <div className="w-full py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center text-xs font-silkscreen text-amber-300">
                  Bárbara ya se encuentra explorando esta región
                </div>
              ) : isSelectedUnlocked ? (
                <button
                  onClick={() => {
                    sound.playConfirm();
                    onFastTravel(selectedRegionId);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 hover:brightness-110 text-white font-silkscreen text-xs rounded-2xl cursor-pointer transition-all shadow-xl shadow-cyan-950 flex items-center justify-center gap-2 border border-cyan-400/40"
                >
                  <Navigation className="w-4 h-4 text-cyan-200" />
                  <span>VIAJAR DE INMEDIATO A {selectedRegion.name.toUpperCase()}</span>
                </button>
              ) : (
                <div className="w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs font-silkscreen text-slate-500 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>REGIÓN BLOQUEADA &middot; COMPLETA LA ETAPA ANTERIOR</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Region Selector Strip */}
          <div className="grid grid-cols-4 gap-2">
            {regionsList.map((id, idx) => {
              const reg = REGIONS_DATA[id];
              const isSelected = id === selectedRegionId;
              const isUnlocked = unlockedRegions.includes(id);

              return (
                <button
                  key={id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedRegionId(id);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md' 
                      : isUnlocked 
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300' 
                      : 'bg-slate-950/60 border-slate-900 opacity-50 text-slate-600'
                  }`}
                >
                  <div className="font-silkscreen text-[10px]">{idx + 1}. {reg.name.split(' ')[0]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono-stat text-slate-500">
        Haz clic en cualquier santuario descubierto en el mapa para revisar sus detalles o viajar instantáneamente con tu equipo.
      </div>
    </div>
  );
};

