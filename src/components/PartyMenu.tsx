/**
 * Party & Final Fantasy III Job Class Management Screen
 * Includes Barbara's Hero Avatar Card and Team Recruitment System definition
 */

import React, { useState, useRef, useEffect } from 'react';
import { SpiritCreature, BarbaraHero, JobClass } from '../types/game';
import { JOBS_CONFIG } from '../data/itemsData';
import { sound } from '../services/audioService';
import { drawBarbaraSprite, drawCreatureSprite } from '../utils/pixelRenderer';
import { Shield, Sparkles, Heart, Zap, Swords, ChevronLeft, Check, Award, User, Crosshair, Users } from 'lucide-react';

interface PartyMenuProps {
  partySpirits: SpiritCreature[];
  barbara: BarbaraHero;
  onChangeJob: (newJob: JobClass) => void;
  onSetLeaderSpirit: (spiritUid: string) => void;
  onClose: () => void;
}

export const PartyMenu: React.FC<PartyMenuProps> = ({
  partySpirits,
  barbara,
  onChangeJob,
  onSetLeaderSpirit,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'spirits' | 'jobs' | 'recruitment'>('spirits');
  const [selectedSpiritUid, setSelectedSpiritUid] = useState<string>(partySpirits[0]?.uid || '');
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spiritCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedSpirit = partySpirits.find(s => s.uid === selectedSpiritUid) || partySpirits[0];

  // Render Barbara's avatar on canvas
  useEffect(() => {
    let animId: number;
    let t = 0;
    const render = () => {
      t += 0.04;
      if (avatarCanvasRef.current) {
        const ctx = avatarCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 120, 120);
          drawBarbaraSprite(ctx, 20, 15, 80, 'down', t, false);
        }
      }
      if (spiritCanvasRef.current && selectedSpirit) {
        const ctx = spiritCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 100, 100);
          drawCreatureSprite(ctx, selectedSpirit.baseId, selectedSpirit.currentStage, 5, 5, 90, t, false);
        }
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [barbara.job, selectedSpirit?.uid, selectedSpirit?.baseId, selectedSpirit?.currentStage]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none p-4 md:p-6 text-white">
      {/* Top Header */}
      <div className="max-w-5xl w-full mx-auto flex justify-between items-center pb-4 border-b border-slate-800">
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
            <h2 className="font-pixel text-sm md:text-base text-emerald-400 flex items-center gap-2">
              <Swords className="w-4 h-4 text-emerald-400" />
              EQUIPO & TRABAJOS DE BÁRBARA
            </h2>
            <p className="text-xs text-slate-400 font-mono">Heroína, miembros activos y reclutamiento de espíritus</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => { sound.playSelect(); setActiveTab('spirits'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'spirits' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bárbara & Equipo ({partySpirits.length})
          </button>
          <button
            onClick={() => { sound.playSelect(); setActiveTab('jobs'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'jobs' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trabajos FF3
          </button>
          <button
            onClick={() => { sound.playSelect(); setActiveTab('recruitment'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'recruitment' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reclutamiento
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto my-4 flex-1">
        {activeTab === 'spirits' && (
          <div className="space-y-4">
            {/* 1. BARBARA HERO AVATAR CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
              {/* Avatar Canvas */}
              <div className="w-24 h-24 rounded-2xl bg-slate-950/80 border-2 border-emerald-400/50 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner relative">
                <canvas ref={avatarCanvasRef} width={120} height={120} className="w-full h-full object-contain image-render-pixel" />
                <div className="absolute top-1 left-1 px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 text-[8px] font-pixel rounded">
                  LÍDER
                </div>
              </div>

              {/* Barbara Stats & Job */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-pixel text-sm text-white">{barbara.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/50 rounded text-[10px] font-mono text-emerald-300 font-bold">
                    {JOBS_CONFIG[barbara.job]?.name} ({JOBS_CONFIG[barbara.job]?.icon})
                  </span>
                  <span className="text-amber-400 font-mono text-xs font-bold">
                    Nv. {barbara.level} &middot; 💰 {barbara.gold} Oro
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono mb-2">
                  {JOBS_CONFIG[barbara.job]?.title} &mdash; <span className="text-emerald-300">{JOBS_CONFIG[barbara.job]?.specialty}</span>
                </p>

                {/* HP & MP Readouts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  <div className="p-1.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[9px] block">Salud Bárbara</span>
                    <span className="text-emerald-400 font-bold">{barbara.currentHp}/{barbara.maxHp} PS</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[9px] block">Poder Mágico</span>
                    <span className="text-sky-400 font-bold">{barbara.currentMp}/{barbara.maxMp} PM</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[9px] block">Orbes Sintonía</span>
                    <span className="text-purple-400 font-bold">{barbara.resonanceOrbs} Disponibles</span>
                  </div>
                  <div className="p-1.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[9px] block">Barra Invocación</span>
                    <span className="text-amber-400 font-bold">{Math.round(barbara.limitGauge)}% Lista</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SPIRITS LIST & DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Spirits list */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <span className="font-pixel text-[11px] text-slate-400 mb-1">ESPÍRITUS EN TU EQUIPO:</span>
                {partySpirits.map((spirit, idx) => {
                  const isSelected = spirit.uid === selectedSpirit?.uid;
                  const isLeader = idx === 0;

                  return (
                    <button
                      key={spirit.uid}
                      onClick={() => {
                        sound.playSelect();
                        setSelectedSpiritUid(spirit.uid);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950' 
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{spirit.evolutionLine[spirit.currentStage - 1]?.icon || '🌱'}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-pixel text-xs text-white">{spirit.name}</span>
                            {isLeader && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-mono font-bold">
                                1° COMBATIENTE
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            Nv. {spirit.level} &middot; PS: {spirit.currentHp}/{spirit.maxHp} &middot; PM: {spirit.currentMp}/{spirit.maxMp}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs uppercase font-mono text-emerald-400 font-bold">
                        {spirit.primaryElement}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Spirit Detailed Stats Card */}
              {selectedSpirit && (
                <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      {/* Creature Avatar Sprite Canvas */}
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner relative">
                        <canvas ref={spiritCanvasRef} width={100} height={100} className="w-full h-full object-contain image-render-pixel" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold tracking-wider">
                          Etapa {selectedSpirit.currentStage} de 3 &middot; {selectedSpirit.rarity}
                        </span>
                        <h3 className="font-pixel text-base text-white">{selectedSpirit.name}</h3>
                        <p className="text-slate-400 text-xs font-mono">{selectedSpirit.lore}</p>
                      </div>
                    </div>

                    {partySpirits[0]?.uid !== selectedSpirit.uid && (
                      <button
                        onClick={() => {
                          sound.playConfirm();
                          onSetLeaderSpirit(selectedSpirit.uid);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-pixel text-[10px] cursor-pointer"
                      >
                        HACER LÍDER
                      </button>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 font-mono text-xs">
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Puntos de Salud (PS)</span>
                      <span className="text-emerald-400 font-bold text-sm">{selectedSpirit.currentHp} / {selectedSpirit.maxHp}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Puntos Mágicos (PM)</span>
                      <span className="text-sky-400 font-bold text-sm">{selectedSpirit.currentMp} / {selectedSpirit.maxMp}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Ataque Físico</span>
                      <span className="text-amber-400 font-bold text-sm">{selectedSpirit.attack}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Defensa Física</span>
                      <span className="text-indigo-400 font-bold text-sm">{selectedSpirit.defense}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Ataque Especial</span>
                      <span className="text-red-400 font-bold text-sm">{selectedSpirit.spAttack}</span>
                    </div>
                    <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <span className="text-slate-500 block text-[10px]">Velocidad</span>
                      <span className="text-teal-400 font-bold text-sm">{selectedSpirit.speed}</span>
                    </div>
                  </div>

                  {/* Known Skills */}
                  <div>
                    <span className="font-pixel text-[11px] text-slate-400 mb-2 block">TÉCNICAS ELEMENTALES:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedSpirit.skills.map((skill) => (
                        <div key={skill.id} className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-white">{skill.name}</span>
                            <span className="font-mono text-sky-400 text-[11px]">{skill.mpCost} PM</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{skill.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: JOBS FF3 */}
        {activeTab === 'jobs' && (
          <div>
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl mb-6">
              <span className="font-pixel text-xs text-sky-400 block mb-1">SISTEMA DE TRABAJOS DE BÁRBARA (FINAL FANTASY III)</span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Bárbara puede cambiar su Arquetipo de Exploradora en cualquier momento fuera de combate. Cada trabajo concede bonificaciones estadísticas permanentes, habilidades tácticas y pasivas que transforman la dinámica de batalla.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(JOBS_CONFIG) as JobClass[]).map((jobKey) => {
                const job = JOBS_CONFIG[jobKey];
                const isCurrent = barbara.job === jobKey;

                return (
                  <div 
                    key={jobKey}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-sky-950/70 border-sky-400 shadow-xl shadow-sky-950' 
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{job.icon}</span>
                        <div>
                          <h4 className="font-pixel text-sm text-white">{job.name}</h4>
                          <span className="text-xs text-sky-300 font-mono">{job.title}</span>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2.5 py-1 bg-sky-500/20 border border-sky-400/50 rounded-lg text-xs font-mono text-sky-300 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> ACTIVO
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playConfirm();
                            onChangeJob(jobKey);
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-sky-600 border border-slate-700 hover:border-sky-500 rounded-lg text-xs font-mono text-slate-200 transition-colors cursor-pointer"
                        >
                          CAMBIAR A ESTA CLASE
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">{job.description}</p>

                    <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono mb-2">
                      <span className="text-amber-400 font-bold block mb-0.5">Especialidad Pasiva:</span>
                      <span className="text-slate-300">{job.specialty}</span>
                    </div>

                    {/* Bonus stats */}
                    <div className="flex gap-2 text-[11px] font-mono text-slate-400">
                      <span>HP +{job.statBonus.hp}</span> &middot;
                      <span>MP +{job.statBonus.mp}</span> &middot;
                      <span>ATQ +{job.statBonus.attack}</span> &middot;
                      <span>DEF +{job.statBonus.defense}</span> &middot;
                      <span>VEL +{job.statBonus.speed}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: RECRUITMENT SYSTEM DEFINITION */}
        {activeTab === 'recruitment' && (
          <div className="space-y-4">
            <div className="p-5 bg-purple-950/40 border-2 border-purple-500/60 rounded-2xl">
              <h3 className="font-pixel text-sm text-purple-300 mb-2 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-purple-400" />
                SISTEMA DE RECLUTAMIENTO & SINTONIZACIÓN DE ESPÍRITUS
              </h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed mb-4">
                Bárbara utiliza la <strong className="text-emerald-300">Reliquia Pewén</strong> y los <strong className="text-purple-300">Orbes de Resonancia</strong> para comulgar con los espíritus elementales chilenos. No se les fuerza a combatir: se sincroniza su frecuencia de onda con la voluntad de salvar los santuarios sagrados.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3.5 bg-slate-950/80 border border-purple-500/30 rounded-xl">
                  <span className="text-purple-300 font-bold font-pixel text-[10px] block mb-1">
                    1. CAPTURA EN COMBATE
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Usa la opción <strong>SINTONIZAR</strong> en combate salvaje. Cada orbe lanzado canaliza energía de Pewén.
                  </p>
                  <div className="mt-2 text-[10px] text-amber-300 bg-amber-950/40 p-1.5 rounded">
                    ⚡ Salud rival &lt; 30%: <strong>85% probabilidad de reclutamiento exitoso</strong>.
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-sky-500/30 rounded-xl">
                  <span className="text-sky-300 font-bold font-pixel text-[10px] block mb-1">
                    2. LÍDER & COMBATIENTES
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Puedes llevar espíritus ilimitados en tu expedición. El primer espíritu seleccionado es el <strong>Líder</strong> que iniciará los combates.
                  </p>
                  <div className="mt-2 text-[10px] text-sky-300 bg-sky-950/40 p-1.5 rounded">
                    🔄 Cambia el líder en cualquier momento usando el botón "Hacer Líder".
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl">
                  <span className="text-emerald-300 font-bold font-pixel text-[10px] block mb-1">
                    3. EVOLUCIÓN ANCESTRAL
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Al subir de nivel mediante combate y usar esencias regionales en el Santuario, tus espíritus desbloquean sus formas Titánicas de Etapa 2 y 3.
                  </p>
                  <div className="mt-2 text-[10px] text-emerald-300 bg-emerald-950/40 p-1.5 rounded">
                    🌱 Cada evolución aporta nuevas técnicas supremas y mayores estadísticas.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
        Bárbara y sus espíritus crecen juntos con cada combate y descubrimiento en Chile.
      </div>
    </div>
  );
};
