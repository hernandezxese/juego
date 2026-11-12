/**
 * Title Screen for Bárbara: Crónicas Elementales del Sur
 * Retro Game Shell with bespoke SVG title lockup, atmospheric Chilean mountain panoramas,
 * audio initialization, and control indicators.
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Compass, Shield, Flame, Droplets, Wind, Mountain } from 'lucide-react';
import { sound } from '../services/audioService';

interface TitleScreenProps {
  onStartGame: () => void;
  onContinueGame?: () => void;
  onResetGame?: () => void;
  hasSave?: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onContinueGame,
  onResetGame,
  hasSave = false,
  isMuted,
  onToggleMute
}) => {
  const [showLore, setShowLore] = useState(false);

  const handleStart = () => {
    sound.init();
    sound.playConfirm();
    onStartGame();
  };

  const handleContinue = () => {
    sound.init();
    sound.playConfirm();
    if (onContinueGame) onContinueGame();
    else onStartGame();
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Background Animated Sky & Chilean Mountain Landscape */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-950 via-indigo-950 to-slate-950">
        {/* Distant Andes & Volcanic Peaks (SVG Silhouette) */}
        <svg 
          className="absolute bottom-0 w-full h-80 opacity-60 pointer-events-none" 
          viewBox="0 0 1200 400" 
          preserveAspectRatio="none"
        >
          {/* Distant Andes Range */}
          <polygon points="0,400 150,220 280,300 450,160 620,290 800,180 980,270 1200,190 1200,400" fill="#0f172a" />
          {/* Volcán Villarrica Peak with Smoldering Crater Glow */}
          <polygon points="400,400 520,130 640,400" fill="#1e1b4b" />
          <circle cx="520" cy="130" r="14" fill="#ef4444" opacity="0.7" className="animate-pulse" />
          {/* Foreground Native Forest Silhouettes (Araucarias & Alerces) */}
          <polygon points="0,400 80,340 180,400 290,330 420,400 560,350 720,400 860,330 1020,390 1200,340 1200,400" fill="#022c22" opacity="0.8" />
        </svg>

        {/* Floating Nature Sparkles / Elemental Embers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23) % 100}%`,
                backgroundColor: i % 4 === 0 ? '#4ade80' : i % 4 === 1 ? '#38bdf8' : i % 4 === 2 ? '#f87171' : '#facc15',
                opacity: 0.6,
                animationDuration: `${3 + (i % 4)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full p-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>RPG TÁCTICO &middot; CHILE NATURE FANTASY</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSelect();
              setShowLore(!showLore);
            }}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showLore ? 'Cerrar Lore' : 'Guía de Expedición'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Main Center: Hero Title Lockup */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        {showLore ? (
          <div className="bg-slate-900/95 border-2 border-emerald-500/50 p-6 md:p-8 rounded-2xl max-w-2xl text-left shadow-2xl shadow-emerald-950/50 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-pixel text-emerald-400 text-sm md:text-base mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              EL VIAJE DE BÁRBARA
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
              Bárbara es una joven botánica y exploradora de Santiago que ha descubierto la <span className="text-emerald-300 font-semibold">Reliquia Pewén</span>, un antiguo talismán capaz de despertar a los espíritus elementales dormidos en la geografía chilena.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/70 border border-emerald-500/30 rounded-lg">
                <span className="text-emerald-400 block font-bold">1. Santiago:</span>
                Valles centrales y orillas del Mapocho.
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-sky-500/30 rounded-lg">
                <span className="text-sky-400 block font-bold">2. Pucón:</span>
                Lagos cristalinos y selva valdiviana.
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-red-500/30 rounded-lg">
                <span className="text-red-400 block font-bold">3. Villarrica:</span>
                El imponente Ruka Pillán y magma eterno.
              </div>
              <div className="p-2.5 bg-slate-950/70 border border-cyan-500/30 rounded-lg">
                <span className="text-cyan-400 block font-bold">4. Hornopirén:</span>
                Fiordos, alerces milenarios y hielo austral.
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Inspirado en el sistema de captura y combate por turnos de <span className="text-amber-400 font-semibold">Pokémon Rojo Fuego</span> junto con el sistema de trabajos tácticos y jefes de <span className="text-indigo-400 font-semibold">Final Fantasy III</span>.
            </p>
            <button
              onClick={() => setShowLore(false)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-pixel text-xs tracking-wider cursor-pointer"
            >
              VOLVER A LA PANTALLA DE TÍTULO
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Elemental Sigils Orbit */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-emerald-400" title="Planta">
                <Droplets className="w-4 h-4 text-emerald-400 rotate-180" />
              </span>
              <span className="p-2 bg-red-950/80 border border-red-500/40 rounded-full text-red-400" title="Fuego">
                <Flame className="w-4 h-4 text-red-400" />
              </span>
              <span className="p-2 bg-sky-950/80 border border-sky-500/40 rounded-full text-sky-400" title="Agua">
                <Droplets className="w-4 h-4 text-sky-400" />
              </span>
              <span className="p-2 bg-purple-950/80 border border-purple-500/40 rounded-full text-purple-400" title="Viento">
                <Wind className="w-4 h-4 text-purple-400" />
              </span>
              <span className="p-2 bg-amber-950/80 border border-amber-500/40 rounded-full text-amber-400" title="Tierra">
                <Mountain className="w-4 h-4 text-amber-400" />
              </span>
            </div>

            {/* Bespoke Retro Title Lockup */}
            <h1 className="font-silkscreen text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-sky-400 drop-shadow-[0_4px_16px_rgba(16,185,129,0.5)] tracking-wide mb-2">
              BÁRBARA
            </h1>
            <h2 className="font-epic text-lg sm:text-2xl md:text-3xl font-bold text-slate-100 tracking-wider uppercase mb-1">
              Crónicas Elementales del Sur
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/90 font-mono-stat tracking-wider mb-8">
              &mdash; El Despertar de los Espíritus Chilenos &mdash;
            </p>

            {/* Start / Continue Button Cluster */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              {hasSave ? (
                <>
                  <button
                    onClick={handleContinue}
                    className="group relative px-7 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 border-2 border-emerald-400 rounded-xl font-silkscreen text-xs sm:text-sm tracking-wider text-white shadow-xl shadow-emerald-950/60 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                      <span>CONTINUAR PARTIDA</span>
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <button
                    onClick={handleStart}
                    className="px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-500 rounded-xl font-silkscreen text-xs tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    NUEVA EXPEDICIÓN
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStart}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 border-2 border-emerald-400/80 rounded-xl font-silkscreen text-xs sm:text-sm tracking-wider text-white shadow-xl shadow-emerald-950/60 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>INICIAR EXPEDICIÓN</span>
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg text-[11px] font-mono text-slate-400">
              <span className="px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-md">
                4 Regiones de Chile
              </span>
              <span className="px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-md">
                Evolución de 3 Etapas
              </span>
              <span className="px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-md">
                Trabajos de Bárbara (FF3)
              </span>
              <span className="px-2.5 py-1 bg-slate-900/60 border border-slate-800 rounded-md">
                Sinergias Elementales
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Control Hint Line (Per Game Craft Guidelines) */}
      <footer className="relative z-10 w-full py-4 px-6 border-t border-slate-800/80 bg-slate-950/90 text-center">
        <p className="font-pixel text-[10px] md:text-xs text-slate-400 tracking-wider">
          <span className="text-emerald-400">WASD / Flechas</span> Mover &middot; <span className="text-amber-400">Espacio / Enter</span> Interactuar / Atacar &middot; <span className="text-cyan-400">B</span> Equipo &middot; <span className="text-purple-400">M</span> Mapa
        </p>
      </footer>
    </div>
  );
};
