/**
 * Adventure Guide & Codex Modal for Bárbara: Crónicas Elementales del Sur
 * Explains clearly what to do in the game, region progress, battle synergies, evolution, and controls
 */

import React, { useState } from 'react';
import { Compass, Swords, Sparkles, ChevronLeft, Shield, MapPin, Heart, Zap, Crosshair } from 'lucide-react';
import { sound } from '../services/audioService';

interface AdventureGuideModalProps {
  onClose: () => void;
}

export const AdventureGuideModal: React.FC<AdventureGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'quest' | 'combat' | 'evolution' | 'controls'>('quest');

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
            <span>Volver al Juego</span>
          </button>
          <div>
            <h2 className="font-pixel text-sm md:text-base text-amber-400 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              GUÍA DE EXPEDICIÓN & MANUAL DE JUEGO
            </h2>
            <p className="text-xs text-slate-400 font-mono">Objetivos paso a paso, mecánicas de combate y evolución profunda</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-mono">
          <button
            onClick={() => { sound.playSelect(); setActiveTab('quest'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'quest' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Misión Principal
          </button>
          <button
            onClick={() => { sound.playSelect(); setActiveTab('combat'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'combat' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Combate & Captura
          </button>
          <button
            onClick={() => { sound.playSelect(); setActiveTab('evolution'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'evolution' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Evolución
          </button>
          <button
            onClick={() => { sound.playSelect(); setActiveTab('controls'); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'controls' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Controles
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full mx-auto my-4 flex-1">
        {/* TAB 1: MISIÓN PRINCIPAL & PROGRESIÓN */}
        {activeTab === 'quest' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl">
              <span className="font-pixel text-xs text-amber-300 block mb-1">
                ¿QUÉ SE DEBE HACER EN EL JUEGO?
              </span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Eres Bárbara y debes atravesar Chile desde Santiago hasta la Patagonia restaurando el equilibrio de la naturaleza. En cada una de las 4 regiones debes: hablar con el habitante local, abrir los cofres con esencias, sortear obstáculos usando elementos de tus espíritus, y purificar al Guardián de la región para desbloquear la siguiente zona.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Región 1 */}
              <div className="p-4 bg-slate-900/90 border border-emerald-500/40 rounded-xl font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-pixel text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center">1</span>
                  SANTIAGO & CERRO SAN CRISTÓBAL
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px]">
                  <li><strong className="text-white">Paso 1:</strong> Habla con Don Ignacio (icono verde al centro) para recibir orbes y ungüentos de matico.</li>
                  <li><strong className="text-white">Paso 2:</strong> Abre los cofres en el parque y el cerro para obtener la <span className="text-emerald-300">Resina de Pewén</span>.</li>
                  <li><strong className="text-white">Paso 3:</strong> Despeja los zarzales espinosos del este usando fuego o camina hacia el sur.</li>
                  <li><strong className="text-white">Paso 4:</strong> Derrota al <span className="text-amber-400 font-bold">Guardián del Mapocho</span> en el puente y cruza el portal sur a Pucón.</li>
                </ul>
              </div>

              {/* Región 2 */}
              <div className="p-4 bg-slate-900/90 border border-sky-500/40 rounded-xl font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold font-pixel text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-sky-950 border border-sky-500 flex items-center justify-center">2</span>
                  PUCÓN & SELVA VALDIVIANA
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px]">
                  <li><strong className="text-white">Paso 1:</strong> Habla con la guardaparques Rayén y recibe Gotas Termales curativas.</li>
                  <li><strong className="text-white">Paso 2:</strong> Explora la orilla del lago para sintonizar (capturar) a Hualita (espíritu de Agua).</li>
                  <li><strong className="text-white">Paso 3:</strong> Usa el poder de Agua para calmar el torrente en el puente del Ojos del Caburgua.</li>
                  <li><strong className="text-white">Paso 4:</strong> Desafía a la <span className="text-sky-300 font-bold">Dama del Caburgua</span> y abre el paso hacia el Volcán Villarrica.</li>
                </ul>
              </div>

              {/* Región 3 */}
              <div className="p-4 bg-slate-900/90 border border-red-500/40 rounded-xl font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold font-pixel text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-red-950 border border-red-500 flex items-center justify-center">3</span>
                  VOLCÁN VILLARRICA (RUKA PILLÁN)
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px]">
                  <li><strong className="text-white">Paso 1:</strong> Encuentra a Nahuel el herrero para conseguir el <span className="text-red-300">Corazón de Basalto</span>.</li>
                  <li><strong className="text-white">Paso 2:</strong> Enfría la gran roca de magma al rojo vivo con un espíritu de Agua o Hielo.</li>
                  <li><strong className="text-white">Paso 3:</strong> Sintoniza a Pillancito o Salamandra Ígnea para potenciar tu daño de fuego.</li>
                  <li><strong className="text-white">Paso 4:</strong> Vence al colosal <span className="text-red-400 font-bold">Pillán del Fuego Eterno</span> en el cráter para desbloquear la Patagonia.</li>
                </ul>
              </div>

              {/* Región 4 */}
              <div className="p-4 bg-slate-900/90 border border-cyan-500/40 rounded-xl font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold font-pixel text-[11px]">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center">4</span>
                  CARRETERA AUSTRAL & HORNOPIRÉN
                </div>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc text-[11px]">
                  <li><strong className="text-white">Paso 1:</strong> Habla con Don Checho junto a los alerces milenarios para recibir infusión de calafate.</li>
                  <li><strong className="text-white">Paso 2:</strong> Derrite el milenario muro de hielo azul usando técnicas de Fuego de alto nivel.</li>
                  <li><strong className="text-white">Paso 3:</strong> Entra al <span className="text-amber-300 font-bold">Santuario de Evolución</span> y evoluciona a tus espíritus a su forma Titánica (Etapa 3).</li>
                  <li><strong className="text-white">Paso 4:</strong> Purifica al <span className="text-cyan-300 font-bold">Coloso de Hornopirén & Ceniza Umbría</span> para salvar la naturaleza de Chile.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMBATE & CAPTURA */}
        {activeTab === 'combat' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl">
              <h3 className="font-pixel text-xs text-red-400 mb-2 flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-red-400" />
                SISTEMA DE COMBATE TÁCTICO (POKÉMON + FINAL FANTASY III)
              </h3>
              <p className="text-xs text-slate-300 font-mono leading-relaxed mb-3">
                El combate es por turnos. Tu espíritu activo ataca con sus 4 técnicas elementales, y Bárbara apoya en paralelo con las habilidades tácticas de su Trabajo actual.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs mb-3">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-red-500/30">
                  <span className="text-red-400 font-bold block">🔥 FUEGO:</span>
                  Super eficaz contra Planta y Hielo. Débil ante Agua y Tierra.
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-sky-500/30">
                  <span className="text-sky-400 font-bold block">💧 AGUA:</span>
                  Super eficaz contra Fuego y Tierra. Débil ante Planta y Hielo.
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold block">🌱 PLANTA:</span>
                  Super eficaz contra Agua y Tierra. Débil ante Fuego y Viento.
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-purple-500/30">
                  <span className="text-purple-400 font-bold block">🌪️ VIENTO:</span>
                  Super eficaz contra Planta. Acelera y dispersa el fuego.
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-amber-500/30">
                  <span className="text-amber-400 font-bold block">🏔️ TIERRA:</span>
                  Super eficaz contra Fuego y Viento. Inmune a temblores.
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-cyan-500/30">
                  <span className="text-cyan-400 font-bold block">❄️ HIELO:</span>
                  Super eficaz contra Viento y Planta. Débil ante Fuego.
                </div>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/50 rounded-xl font-mono text-xs space-y-1">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5" /> ¿CÓMO SINTONIZAR (CAPTURAR) ESPÍRITUS?
                </span>
                <p className="text-slate-300 text-[11px]">
                  En combate salvaje, presiona el botón <strong className="text-purple-300">SINTONIZAR</strong>. Bárbara lanzará un Orbe de Resonancia Pewén. <em>Consejo: Reduce la salud del rival a menos del 30% antes de lanzar el orbe para asegurar una captura exitosa (85% de probabilidad).</em>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EVOLUCIÓN PROFUNDA */}
        {activeTab === 'evolution' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/90 border border-emerald-500/40 rounded-2xl font-mono text-xs">
              <h3 className="font-pixel text-xs text-emerald-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                SISTEMA DE EVOLUCIÓN EN EL SANTUARIO
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                Cada espíritu tiene 3 etapas evolutivas completas que multiplican sus puntos de salud, ataque, defensa y velocidad, además de otorgarles técnicas devastadoras.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-emerald-400 font-bold block">Etapa 1 ➔ Etapa 2 (Nivel 10):</span>
                    <span className="text-slate-400 text-[11px]">Requiere nivel 10 + Catalizador regional (Resina de Pewén, Gotas de Pucón, etc.).</span>
                  </div>
                  <span className="text-emerald-300 text-[11px] font-bold">+45 PS / +18 ATQ</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold block">Etapa 2 ➔ Etapa 3 Titán (Nivel 22):</span>
                    <span className="text-slate-400 text-[11px]">Desbloquea la forma ancestral legendaria del espíritu con su técnica definitiva.</span>
                  </div>
                  <span className="text-amber-300 text-[11px] font-bold">+70 PS / +30 ATQ</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200">
                Puedes abrir el <strong>Santuario de Evolución</strong> en cualquier momento desde el botón superior o presionando la tecla [E] en la pantalla de exploración.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTROLES */}
        {activeTab === 'controls' && (
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl font-mono text-xs space-y-4">
            <h3 className="font-pixel text-xs text-cyan-400">CONTROLES & MOVIMIENTO FLUIDO</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block mb-1">Mover a Bárbara:</span>
                <span className="text-slate-300">Teclas [W, A, S, D] o [Flechas del Teclado]. También puedes mantener presionado el D-Pad táctil en pantalla.</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block mb-1">Acción / Hablar / Abrir:</span>
                <span className="text-slate-300">Tecla [Espacio] o [Enter] o el botón grande circular dorado [ACCIÓN].</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sky-400 font-bold block mb-1">Equipo & Trabajos (FF3):</span>
                <span className="text-slate-300">Tecla [B] o botón de "Equipo". Permite cambiar el trabajo de Bárbara y revisar tus espíritus.</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-purple-400 font-bold block mb-1">Mapa de Chile:</span>
                <span className="text-slate-300">Tecla [M] o botón "Mapa". Permite viaje rápido a cualquier región desbloqueada.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto pt-3 border-t border-slate-800 text-center text-[11px] font-mono text-slate-500">
        ¡Buena suerte en tu expedición, Bárbara! La armonía de la naturaleza depende de ti.
      </div>
    </div>
  );
};
