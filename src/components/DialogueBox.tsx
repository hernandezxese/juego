/**
 * Retro RPG Dialogue Box for Bárbara: Crónicas Elementales del Sur
 * Inspired by Pokémon FireRed and classic JRPG dialogue presentations
 */

import React, { useEffect, useState } from 'react';
import { sound } from '../services/audioService';

interface DialogueBoxProps {
  speakerName: string;
  lines: string[];
  onComplete: () => void;
  portraitType?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  lines,
  onComplete,
  portraitType = 'npc'
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentFullLine = lines[currentLineIndex] || '';

  // Typewriter effect
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < currentFullLine.length) {
        setDisplayedText(currentFullLine.substring(0, charIndex + 1));
        if (charIndex % 3 === 0) {
          sound.playStep();
        }
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [currentLineIndex, currentFullLine]);

  // Handle advancing dialogue
  const handleAdvance = () => {
    if (isTyping) {
      // Finish line immediately
      setDisplayedText(currentFullLine);
      setIsTyping(false);
    } else {
      sound.playSelect();
      if (currentLineIndex < lines.length - 1) {
        setCurrentLineIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }
  };

  // Keyboard support for advancing or closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        sound.playCancel();
        onComplete();
      } else if (e.code === 'Space' || e.code === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentLineIndex, lines]);

  // Determine portrait emoji / icon
  const getPortrait = () => {
    if (speakerName.toLowerCase().includes('bárbara') || speakerName.toLowerCase().includes('barbara')) return '🎒';
    if (speakerName.toLowerCase().includes('pillán') || speakerName.toLowerCase().includes('volcán')) return '🌋';
    if (speakerName.toLowerCase().includes('dama') || speakerName.toLowerCase().includes('garza')) return '🪶';
    if (speakerName.toLowerCase().includes('profesor') || speakerName.toLowerCase().includes('ignacio')) return '📜';
    if (speakerName.toLowerCase().includes('guardaparque') || speakerName.toLowerCase().includes('rayén')) return '🌲';
    if (speakerName.toLowerCase().includes('alercero') || speakerName.toLowerCase().includes('checho')) return '🪵';
    if (speakerName.toLowerCase().includes('coloso')) return '🏔️';
    return '💬';
  };

  return (
    <div 
      className="absolute bottom-4 left-4 right-4 md:left-12 md:right-12 z-50 select-none"
    >
      <div 
        onClick={handleAdvance}
        className="bg-slate-900/95 border-4 border-amber-500/80 rounded-xl p-4 md:p-5 shadow-2xl shadow-black/80 flex items-start gap-4 cursor-pointer relative"
      >
        {/* Close Button in top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playCancel();
            onComplete();
          }}
          className="absolute top-2 right-2 p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center gap-1 z-10"
          title="Cerrar Diálogo [Esc]"
        >
          <span>Cerrar</span>
          <span>✕</span>
        </button>

        {/* Speaker Portrait Box */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-slate-950 border-2 border-amber-400/50 flex-shrink-0 flex items-center justify-center text-3xl md:text-4xl shadow-inner">
          {getPortrait()}
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pr-16">
          <div className="inline-block px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-amber-300 font-pixel text-[11px] mb-2 tracking-wide">
            {speakerName}
          </div>

          <p className="text-white text-xs md:text-sm font-retro text-lg md:text-xl leading-snug tracking-wide min-h-[48px]">
            {displayedText}
          </p>

          <div className="flex justify-between items-center mt-2 text-[10px] font-mono text-slate-400">
            <span>Línea {currentLineIndex + 1} de {lines.length}</span>
            <span className="text-amber-400 animate-bounce font-pixel">
              {isTyping ? '···' : '▼ [Espacio / Tap]'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
