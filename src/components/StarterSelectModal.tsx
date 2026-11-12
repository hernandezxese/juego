/**
 * Starter Spirit Selection Screen for Bárbara: Crónicas Elementales del Sur
 * Inspired by classic Pokémon starter choice (Fire / Water / Grass)
 * Features:
 * - 3 Chilean native starters: Brotín (Planta), Pillancito (Fuego), Hualita (Agua)
 * - Animated pixel sprite preview
 * - Audio preview for elemental sound
 * - Tactical stats breakdown & lore
 */

import React, { useState, useEffect, useRef } from 'react';
import { SpiritCreature, ElementType } from '../types/game';
import { createSpiritInstance } from '../data/spiritsData';
import { sound } from '../services/audioService';
import { drawCreatureSprite } from '../utils/pixelRenderer';
import { Sparkles, Flame, Droplets, Leaf, Shield, Zap, Heart, Check, Volume2 } from 'lucide-react';

interface StarterSelectModalProps {
  onSelectStarter: (chosenSpirit: SpiritCreature) => void;
}

interface StarterOption {
  id: 'brotin' | 'pillancito' | 'hualita';
  name: string;
  element: ElementType;
  title: string;
  role: string;
  accentColor: string;
  badgeBg: string;
  description: string;
  tacticalNote: string;
  signatureMove: { name: string; power: number; desc: string };
  stats: { hp: number; atk: number; def: number; spAtk: number; spd: number };
}

const STARTERS: StarterOption[] = [
  {
    id: 'brotin',
    name: 'Brotín',
    element: 'planta',
    title: 'Guardián del Espinal Central',
    role: 'Tanque Protector & Espinas',
    accentColor: '#10b981',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Nacido en los faldeos precordilleranos de Santiago. Su cuerpo está cubierto de hojas medicinales y espinas de peumo que sanan el cansancio.',
    tacticalNote: 'Excelente resiliencia, alta defensa y regeneración continua. Fuerte contra Agua y Tierra.',
    signatureMove: {
      name: 'Espina Brotante',
      power: 28,
      desc: 'Lanza espinas vegetales que reducen la defensa del objetivo.'
    },
    stats: { hp: 55, atk: 18, def: 24, spAtk: 16, spd: 14 }
  },
  {
    id: 'pillancito',
    name: 'Pillancito',
    element: 'fuego',
    title: 'Chispa del Ruka Pillán',
    role: 'Atacante Especial & Quemadura',
    accentColor: '#f97316',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    description: 'Una criatura ígnea surgida del magma vivo del Volcán Villarrica. Sus pequeñas llamas arden con pasión y orgullo ancestral.',
    tacticalNote: 'Altísimo poder destructivo y velocidad inicial. Fuerte contra Planta y Hielo.',
    signatureMove: {
      name: 'Chispa Volcánica',
      power: 32,
      desc: 'Dispara proyectiles incandescentes con probabilidad de quemar al rival.'
    },
    stats: { hp: 46, atk: 22, def: 15, spAtk: 26, spd: 22 }
  },
  {
    id: 'hualita',
    name: 'Hualita',
    element: 'agua',
    title: 'Garza de las Aguas Sagradas',
    role: 'Ágil Acuática & Vórtice',
    accentColor: '#0ea5e9',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    description: 'Habita las riberas del lago Villarrica y los ríos de Pucón. Sus plumas turquesas repelen la ceniza y canalizan la pureza del agua.',
    tacticalNote: 'Equilibrio perfecto, movimientos veloces y resistencia térmica. Fuerte contra Fuego y Tierra.',
    signatureMove: {
      name: 'Chorro del Trancura',
      power: 27,
      desc: 'Un potente torrente de agua cristalina que desconcierta al oponente.'
    },
    stats: { hp: 50, atk: 19, def: 18, spAtk: 22, spd: 25 }
  }
];

export const StarterSelectModal: React.FC<StarterSelectModalProps> = ({ onSelectStarter }) => {
  const [selectedStarterId, setSelectedStarterId] = useState<'brotin' | 'pillancito' | 'hualita'>('brotin');
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // Animate starters pixel canvas
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      STARTERS.forEach(s => {
        const canvas = canvasRefs.current[s.id];
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, 130, 130);
            drawCreatureSprite(ctx, s.id, 1, 5, 5, 120, t + (s.id === 'pillancito' ? 1.5 : s.id === 'hualita' ? 3.0 : 0), false);
          }
        }
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePreviewSound = (s: StarterOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (s.element === 'fuego') sound.playFireSpell();
    else if (s.element === 'agua') sound.playWaterSpell();
    else sound.playEarthSpell();
  };

  const handleConfirmChoice = () => {
    sound.playEvolutionSequence();
    // Create initial level 2 starter
    const starterSpirit = createSpiritInstance(selectedStarterId, 2, 1);
    onSelectStarter(starterSpirit);
  };

  const activeStarter = STARTERS.find(s => s.id === selectedStarterId)!;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl max-w-4xl w-full shadow-2xl p-5 sm:p-7 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
        {/* Header: Don Ignacio's Presentation */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-silkscreen">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ELECCIÓN DEL COMPAÑERO INICIAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-silkscreen text-white drop-shadow">
            Sintoniza tu Primer Espíritu Elemental
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-ui max-w-2xl mx-auto leading-relaxed">
            <span className="text-amber-300 font-bold">Don Ignacio:</span> &ldquo;Bárbara, antes de cruzar los valles de Santiago rumbo al sur profundo, la naturaleza te ofrece un vínculo sagrado. ¿Cuál de estos tres guardianes caminará a tu lado?&rdquo;
          </p>
        </div>

        {/* 3 Starter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {STARTERS.map(s => {
            const isSelected = selectedStarterId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  sound.playSelect();
                  setSelectedStarterId(s.id);
                }}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all border-2 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-slate-800/90 border-amber-400 shadow-xl shadow-amber-950/40 scale-[1.02]' 
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                {/* Active Selection Check badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}

                <div>
                  {/* Sprite Box */}
                  <div className="relative w-full aspect-square max-h-36 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-2 mb-3 overflow-hidden">
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${s.accentColor}, transparent 70%)` }}
                    />
                    <canvas 
                      ref={el => { canvasRefs.current[s.id] = el; }} 
                      width={130} 
                      height={130} 
                      className="image-render-pixel w-28 h-28 object-contain relative z-10"
                    />

                    {/* Audio preview button */}
                    <button
                      type="button"
                      onClick={(e) => handlePreviewSound(s, e)}
                      title="Escuchar sonido elemental"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer z-20"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Element Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-silkscreen text-base text-white font-bold">{s.name}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-silkscreen border uppercase ${s.badgeBg}`}>
                      {s.element}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-300/90 font-mono-stat font-semibold mb-2">
                    {s.title}
                  </p>

                  <p className="text-xs text-slate-300 font-ui leading-relaxed line-clamp-3 mb-3">
                    {s.description}
                  </p>
                </div>

                {/* Base Stat Mini Bars */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[10px] font-mono-stat">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>PS: {s.stats.hp}</span>
                    <span>ATQ: {s.stats.atk}</span>
                    <span>DEF: {s.stats.def}</span>
                    <span>VEL: {s.stats.spd}</span>
                  </div>
                  <div className="bg-slate-900 rounded p-1.5 text-[11px] text-emerald-400 font-mono-stat">
                    <span className="text-slate-400">Técnica: </span>
                    <span className="font-bold">{s.signatureMove.name}</span> (Pot. {s.signatureMove.power})
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Starter Detailed Summary & Confirmation */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs text-slate-400 font-ui">
              Has seleccionado a <strong className="text-white font-silkscreen">{activeStarter.name}</strong> ({activeStarter.element.toUpperCase()})
            </div>
            <div className="text-xs text-emerald-300 font-mono-stat">
              {activeStarter.tacticalNote}
            </div>
          </div>

          <button
            onClick={handleConfirmChoice}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-silkscreen text-xs rounded-xl shadow-xl shadow-emerald-950 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>¡ELEGIR A {activeStarter.name.toUpperCase()}!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
