/**
 * System / Options Menu Modal
 * Bárbara: Crónicas Elementales del Sur
 * Consolidates Save/Load (3 slots), Game Reset, Audio toggle, and Adventure Guide.
 * Clarifies physical shop location in Santiago.
 */

import React from 'react';
import { sound } from '../services/audioService';
import { 
  FolderOpen, 
  RotateCcw, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  X, 
  Compass, 
  HelpCircle 
} from 'lucide-react';

interface SystemMenuModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSaveLoad: () => void;
  onRequestReset: () => void;
  onOpenGuide: () => void;
  onClose: () => void;
}

export const SystemMenuModal: React.FC<SystemMenuModalProps> = ({
  isMuted,
  onToggleMute,
  onOpenSaveLoad,
  onRequestReset,
  onOpenGuide,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150 font-mono text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h2 className="font-silkscreen text-sm text-white">MENÚ DEL SISTEMA</h2>
              <p className="text-[10px] text-slate-400">Opciones, partidas y configuración</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Buttons Grid */}
        <div className="space-y-2.5">
          {/* 1. Guardar y Cargar (3 Ranuras) */}
          <button
            onClick={() => {
              sound.playConfirm();
              onClose();
              onOpenSaveLoad();
            }}
            className="w-full p-3 bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/80 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-silkscreen text-xs text-white group-hover:text-emerald-300">
                  GUARDAR / CARGAR PARTIDA
                </div>
                <div className="text-[10px] text-slate-400">
                  Administra las 3 ranuras de guardado en memoria
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-emerald-400">&rarr;</span>
          </button>

          {/* 2. Guía de Aventuras */}
          <button
            onClick={() => {
              sound.playSelect();
              onClose();
              onOpenGuide();
            }}
            className="w-full p-3 bg-slate-800/80 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/80 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="font-silkscreen text-xs text-white group-hover:text-amber-300">
                  GUÍA DE AVENTURA & MISIONES
                </div>
                <div className="text-[10px] text-slate-400">
                  Objetivos, tabla elemental y secretos
                </div>
              </div>
            </div>
            <span className="text-slate-500 group-hover:text-amber-400">&rarr;</span>
          </button>

          {/* 3. Audio / Silenciar */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="w-full p-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-700/60 border border-slate-600 flex items-center justify-center text-slate-300">
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <div>
                <div className="font-silkscreen text-xs text-white">
                  AUDIO Y EFECTOS SONOROS
                </div>
                <div className="text-[10px] text-slate-400">
                  {isMuted ? 'Sonido silenciado' : 'Sonido Chiptune activado'}
                </div>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isMuted ? 'bg-rose-900/60 text-rose-300 border border-rose-700' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'}`}>
              {isMuted ? 'MUTE' : 'ACTIVO'}
            </span>
          </button>

          {/* 4. Reiniciar Partida */}
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
              onRequestReset();
            }}
            className="w-full p-3 bg-slate-800/60 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-500/70 rounded-xl flex items-center justify-between text-left cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <div className="font-silkscreen text-xs text-rose-300">
                  REINICIAR PARTIDA
                </div>
                <div className="text-[10px] text-slate-400">
                  Restablecer todo el juego y volver al inicio
                </div>
              </div>
            </div>
            <span className="text-rose-500">&rarr;</span>
          </button>
        </div>

        {/* Note on Physical Shop */}
        <div className="mt-4 p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-[10px] text-amber-300 flex items-start gap-2.5">
          <ShoppingBag className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Ubicación de la Tienda de Provisiones:</span>
            <p className="text-slate-300 mt-0.5">
              La Botica de Don Manuel es un puesto físico en el <span className="text-amber-200 font-bold">Stage 1 (Santiago)</span>. Acércate a su tienda junto al camino para comprar pociones de vida, pociones de maná y orbes de captura.
            </p>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playCancel();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold cursor-pointer"
          >
            Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};
