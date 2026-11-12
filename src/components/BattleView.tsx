/**
 * Tactical Battle System: Pokémon FireRed + Final Fantasy III Hybrid
 * Features:
 * - Opening Encounter Intro with Enemy Sprite & Dialogue
 * - Elemental visual attack effects (Fire, Water, Plant/Earth, Wind, Ice, Holy, Physical) with ZERO screen shaking
 * - Active Nature Spirit + Barbara's Job commands
 * - Sintonización (Capture mechanic) with Pewén Orbs
 * - Invocaciones de la Naturaleza (Limit Break gauge)
 * - Prominent Flee [🏃 HUIR] command
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  SpiritCreature, 
  BarbaraHero, 
  ElementalSkill, 
  InventoryItem, 
  BattleLogEntry, 
  ElementType 
} from '../types/game';
import { getElementalMultiplier, checkNewMovesToLearn } from '../data/spiritsData';
import { JOBS_CONFIG } from '../data/itemsData';
import { sound } from '../services/audioService';
import { drawCreatureSprite } from '../utils/pixelRenderer';
import { 
  Sparkles, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Shield, 
  Heart, 
  Zap, 
  Swords, 
  Backpack, 
  Crosshair, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users
} from 'lucide-react';

interface BattleViewProps {
  playerSpirit: SpiritCreature;
  partySpirits?: SpiritCreature[];
  barbara: BarbaraHero;
  enemySpirit: SpiritCreature;
  isBossBattle?: boolean;
  inventory: Record<string, InventoryItem>;
  regionThemeColor: string;
  regionId: string;
  onVictory: (updatedPlayerSpirit: SpiritCreature, updatedBarbara: BarbaraHero, capturedSpirit?: SpiritCreature) => void;
  onDefeat: () => void;
  onFlee: () => void;
  onUseItem: (itemId: string, targetUid: string) => void;
  onSwitchActiveSpirit?: (spiritUid: string) => void;
}

export const BattleView: React.FC<BattleViewProps> = ({
  playerSpirit: initialPlayerSpirit,
  partySpirits = [],
  barbara: initialBarbara,
  enemySpirit: initialEnemySpirit,
  isBossBattle = false,
  inventory,
  regionThemeColor,
  regionId,
  onVictory,
  onDefeat,
  onFlee,
  onUseItem,
  onSwitchActiveSpirit
}) => {
  // State
  const [playerSpirit, setPlayerSpirit] = useState<SpiritCreature>(initialPlayerSpirit);
  const [enemySpirit, setEnemySpirit] = useState<SpiritCreature>(initialEnemySpirit);
  const [barbara, setBarbara] = useState<BarbaraHero>(initialBarbara);

  // Encounter Intro Overlay per user request
  const [showEncounterIntro, setShowEncounterIntro] = useState(true);

  // Elemental Visual Attack Effect (Zero screen shaking, rich elemental particles)
  const [activeAttackEffect, setActiveAttackEffect] = useState<{
    element: ElementType;
    isTargetEnemy: boolean;
    skillName: string;
  } | null>(null);

  // UI state
  const [actionCategory, setActionCategory] = useState<'main' | 'skills' | 'barbara_skills' | 'party_switch' | 'items' | 'confirm_flee'>('main');
  const [activeSummonCinematic, setActiveSummonCinematic] = useState<{ name: string; element: string } | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>([
    {
      id: 'init_1',
      text: isBossBattle 
        ? `¡El colosal ${enemySpirit.name} emerge como guardián ancestral!` 
        : `¡Un ${enemySpirit.name} salvaje de nivel ${enemySpirit.level} ha aparecido!`,
      type: 'info'
    }
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playerHitFlash, setPlayerHitFlash] = useState(false);
  const [enemyHitFlash, setEnemyHitFlash] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; color: string; isEnemy: boolean }[]>([]);

  // Canvas refs for animated sprite rendering
  const playerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const enemyCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const introCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cinematicCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const actionAvatarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sound & BGM trigger
  useEffect(() => {
    sound.playBgm('battle');
    return () => {
      sound.playBgm(regionId);
    };
  }, [regionId]);

  // Handle Space/Enter to dismiss Encounter Intro
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showEncounterIntro && (e.code === 'Space' || e.code === 'Enter')) {
        sound.playConfirm();
        setShowEncounterIntro(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showEncounterIntro]);

  // Sprite animation loop
  useEffect(() => {
    let animId: number;
    let t = 0;
    const render = () => {
      t += 0.05;
      if (playerCanvasRef.current) {
        const ctx = playerCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 160, 160);
          drawCreatureSprite(ctx, playerSpirit.baseId, playerSpirit.currentStage, 10, 10, 140, t, false);
        }
      }
      if (actionAvatarCanvasRef.current) {
        const ctx = actionAvatarCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 48, 48);
          drawCreatureSprite(ctx, playerSpirit.baseId, playerSpirit.currentStage, 2, 2, 44, t, false);
        }
      }
      if (enemyCanvasRef.current) {
        const ctx = enemyCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 160, 160);
          drawCreatureSprite(ctx, enemySpirit.baseId, enemySpirit.currentStage, 10, 10, 140, t + 1.5, true);
        }
      }
      if (introCanvasRef.current && showEncounterIntro) {
        const ctx = introCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 180, 180);
          drawCreatureSprite(ctx, enemySpirit.baseId, enemySpirit.currentStage, 10, 10, 160, t + 1.0, true);
        }
      }
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [playerSpirit, enemySpirit, showEncounterIntro]);

  // Add floating combat text
  const addFloatingText = (text: string, color: string, isEnemy: boolean) => {
    const id = `fl_${Date.now()}_${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, color, isEnemy }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1200);
  };

  // Play elemental sound effect
  const playElementSfx = (element: ElementType) => {
    if (element === 'fuego') sound.playFireSpell();
    else if (element === 'agua') sound.playWaterSpell();
    else if (element === 'planta' || element === 'tierra') sound.playEarthSpell();
    else if (element === 'viento') sound.playWindSpell();
    else sound.playAttackSlash();
  };

  // Trigger Elemental Visual Attack Effect (Zero Screen Shake)
  const triggerElementalVfx = (element: ElementType, isTargetEnemy: boolean, skillName: string) => {
    setActiveAttackEffect({ element, isTargetEnemy, skillName });
    setTimeout(() => {
      setActiveAttackEffect(null);
    }, 700);
  };

  // Handle Player Spirit Move
  const handleSpiritSkill = async (skill: ElementalSkill) => {
    if (isAnimating) return;
    if (playerSpirit.currentMp < skill.mpCost) {
      sound.playCancel();
      addLog('¡No tienes suficiente PM para usar esta técnica!', 'info');
      return;
    }

    setIsAnimating(true);
    sound.playConfirm();

    // Deduct MP
    setPlayerSpirit(prev => ({
      ...prev,
      currentMp: Math.max(0, prev.currentMp - skill.mpCost)
    }));

    // Play skill animation sound & elemental visual effect on target
    playElementSfx(skill.element);
    triggerElementalVfx(skill.element, true, skill.name);

    // Calculate Damage / Healing
    if (skill.category === 'heal') {
      const healAmount = Math.round(playerSpirit.maxHp * 0.45);
      const newHp = Math.min(playerSpirit.maxHp, playerSpirit.currentHp + healAmount);
      setPlayerSpirit(prev => ({ ...prev, currentHp: newHp }));
      sound.playHeal();
      addFloatingText(`+${healAmount} PS`, '#4ade80', false);
      addLog(`¡${playerSpirit.name} usó ${skill.name} y restauró ${healAmount} PS!`, 'heal');

      // Increase Barbara's Limit Gauge
      setBarbara(prev => ({
        ...prev,
        limitGauge: Math.min(100, prev.limitGauge + 15)
      }));

      await wait(900);
      enemyTurn(playerSpirit, enemySpirit);
      return;
    }

    // Elemental multiplier check
    const { multiplier, message } = getElementalMultiplier(skill.element, enemySpirit.primaryElement);
    const baseDamage = Math.round(
      ((2 * playerSpirit.level / 5 + 2) * skill.power * (playerSpirit.spAttack / Math.max(1, enemySpirit.spDefense)) / 50 + 2) * multiplier
    );
    const finalDamage = Math.max(5, Math.round(baseDamage * (0.9 + Math.random() * 0.2)));

    // Enemy hit visual feedback (Flash without screen shake)
    setEnemyHitFlash(true);
    if (multiplier >= 2.0) {
      sound.playCriticalHit();
    } else {
      sound.playHit();
    }

    addFloatingText(`-${finalDamage}`, multiplier >= 2.0 ? '#facc15' : '#ef4444', true);
    addLog(`¡${playerSpirit.name} ejecutó ${skill.name}! Infligió ${finalDamage} de daño. ${message}`, multiplier >= 2.0 ? 'critical' : 'damage');

    // Charge Limit Gauge
    setBarbara(prev => ({
      ...prev,
      limitGauge: Math.min(100, prev.limitGauge + (multiplier >= 2.0 ? 25 : 15))
    }));

    const remainingEnemyHp = Math.max(0, enemySpirit.currentHp - finalDamage);
    const updatedEnemy = { ...enemySpirit, currentHp: remainingEnemyHp };
    setEnemySpirit(updatedEnemy);

    await wait(600);
    setEnemyHitFlash(false);

    // Check Victory
    if (remainingEnemyHp <= 0) {
      handleVictorySequence(playerSpirit, updatedEnemy);
      return;
    }

    // Proceed to Enemy Turn
    await wait(700);
    enemyTurn(playerSpirit, updatedEnemy);
  };

  // Handle Barbara's Job Special Move (Strict MP consumption per user request)
  const handleBarbaraSkill = async (skillType: string) => {
    if (isAnimating) return;
    const mpCosts: Record<string, number> = {
      heal: 8,
      barrier: 10,
      synthesis: 25,
    };
    const cost = mpCosts[skillType] || 0;
    if (barbara.currentMp < cost) {
      sound.playCancel();
      addLog(`¡Bárbara no tiene suficiente Maná (requiere ${cost} PM)!`, 'info');
      return;
    }

    setIsAnimating(true);
    sound.playConfirm();

    // Deduct Barbara's MP and increase Limit gauge
    setBarbara(prev => ({
      ...prev,
      currentMp: Math.max(0, prev.currentMp - cost),
      limitGauge: Math.min(100, prev.limitGauge + 20)
    }));

    if (skillType === 'heal') {
      const healAmount = 90;
      triggerElementalVfx('planta', false, 'Ungüento de Matico');
      setPlayerSpirit(prev => ({ ...prev, currentHp: Math.min(prev.maxHp, prev.currentHp + healAmount) }));
      sound.playHeal();
      addFloatingText(`+${healAmount} PS`, '#34d399', false);
      addLog(`¡Bárbara aplicó Ungüento de Matico (-${cost} PM) y restauró ${healAmount} PS a ${playerSpirit.name}!`, 'heal');
    } else if (skillType === 'barrier') {
      triggerElementalVfx('planta', false, 'Manto de Coigüe');
      sound.playHeal();
      setPlayerSpirit(prev => ({ ...prev, defense: Math.round(prev.defense * 1.4) }));
      addFloatingText(`DEF +40%`, '#38bdf8', false);
      addLog(`¡Bárbara desplegó Manto de Coigüe (-${cost} PM)! La defensa del espíritu se incrementó.`, 'status');
    } else if (skillType === 'synthesis') {
      triggerElementalVfx('sagrado', true, 'Fusión Elemental');
      sound.playCriticalHit();
      const synthDamage = 85;
      const remainingEnemyHp = Math.max(0, enemySpirit.currentHp - synthDamage);
      setEnemySpirit(prev => ({ ...prev, currentHp: remainingEnemyHp }));
      setEnemyHitFlash(true);
      addFloatingText(`-${synthDamage} FUSIÓN`, '#fbbf24', true);
      addLog(`¡Bárbara canalizó una Fusión Elemental (-${cost} PM) causando ${synthDamage} de daño masivo!`, 'critical');
      await wait(600);
      setEnemyHitFlash(false);
      if (remainingEnemyHp <= 0) {
        handleVictorySequence(playerSpirit, { ...enemySpirit, currentHp: 0 });
        return;
      }
    }

    await wait(800);
    enemyTurn(playerSpirit, enemySpirit);
  };

  // Switch Active Spirit in Battle (FF3 / Pokémon style)
  const handleSwitchSpirit = async (newSpiritUid: string) => {
    if (isAnimating) return;
    const targetSpirit = partySpirits.find(s => s.uid === newSpiritUid);
    if (!targetSpirit || targetSpirit.uid === playerSpirit.uid) return;

    if (targetSpirit.currentHp <= 0) {
      sound.playCancel();
      addLog(`¡${targetSpirit.name} no puede combatir porque está debilitado!`, 'info');
      return;
    }

    setIsAnimating(true);
    sound.playConfirm();
    addLog(`¡Bárbara retira a ${playerSpirit.name} y envía al combate a ${targetSpirit.name}!`, 'status');

    // Inform parent app of switch
    if (onSwitchActiveSpirit) {
      onSwitchActiveSpirit(targetSpirit.uid);
    }
    setPlayerSpirit(targetSpirit);
    setActionCategory('main');

    await wait(1000);
    // Switching takes a turn: enemy attacks the newly entered spirit
    enemyTurn(targetSpirit, enemySpirit);
  };

  // Invocación de la Naturaleza (Limit Break: 1 use per charge with cinematic fullscreen sequence)
  const handleNatureSummon = async () => {
    if (barbara.limitGauge < 100 || isAnimating) return;
    setIsAnimating(true);
    sound.playCriticalHit();

    // Immediately exhaust limit gauge to guarantee exactly 1 use
    setBarbara(prev => ({ ...prev, limitGauge: 0 }));

    const summonNames: Record<string, string> = {
      santiago: 'Furia del Pewén Ancestral',
      pucon: 'Torrente Sagrado del Caburgua',
      villarrica: 'Cataclismo del Ruka Pillán',
      hornopiren: 'Resplandor Glaciar del Alerce'
    };
    const summonName = summonNames[regionId] || 'Latido de la Tierra';
    const summonElement = regionId === 'santiago' ? 'planta' : regionId === 'pucon' ? 'agua' : regionId === 'villarrica' ? 'fuego' : 'hielo';

    // Launch Fullscreen Cinematic Overlay
    setActiveSummonCinematic({ name: summonName, element: summonElement });

    addLog(`¡BÁRBARA DESATA EL PODER PRIMIGENIO: INVOCACIÓN DE ${summonName.toUpperCase()}!`, 'critical');

    // Wait for cinematic buildup
    await wait(2400);
    setActiveSummonCinematic(null);

    triggerElementalVfx('sagrado', true, summonName);

    // Massive damage + team full heal
    const summonDamage = 160;
    const remainingEnemyHp = Math.max(0, enemySpirit.currentHp - summonDamage);

    setEnemySpirit(prev => ({ ...prev, currentHp: remainingEnemyHp }));
    setPlayerSpirit(prev => ({ ...prev, currentHp: prev.maxHp, currentMp: prev.maxMp }));
    setEnemyHitFlash(true);
    addFloatingText(`-${summonDamage} CATACLISMO`, '#f43f5e', true);
    addFloatingText(`RECUPERACIÓN TOTAL`, '#4ade80', false);

    await wait(900);
    setEnemyHitFlash(false);

    if (remainingEnemyHp <= 0) {
      handleVictorySequence(playerSpirit, { ...enemySpirit, currentHp: 0 });
      return;
    }

    await wait(800);
    enemyTurn(playerSpirit, { ...enemySpirit, currentHp: remainingEnemyHp });
  };

  // Sintonizar (Pokémon-style capture)
  const handleCapture = async () => {
    if (isAnimating) return;
    const orbs = inventory.orbe_resonancia?.count || 0;
    if (orbs <= 0) {
      sound.playCancel();
      addLog('¡No te quedan Orbes de Resonancia Pewén para capturar!', 'info');
      return;
    }

    setIsAnimating(true);
    sound.playConfirm();
    onUseItem('orbe_resonancia', enemySpirit.uid);

    addLog(`¡Bárbara lanzó un Orbe de Resonancia Pewén hacia ${enemySpirit.name}!`, 'capture');

    // Calculate capture rate based on remaining HP
    const hpPercent = enemySpirit.currentHp / enemySpirit.maxHp;
    const baseCaptureRate = isBossBattle ? 0.35 : 0.70;
    const captureChance = baseCaptureRate * (1.6 - hpPercent);

    await wait(1000);

    const success = Math.random() < captureChance;
    if (success) {
      sound.playCaptureSuccess();
      addLog(`¡ÉXITO TOTAL! ${enemySpirit.name} ha sincronizado su esencia y se une a tu equipo.`, 'status');
      addFloatingText(`¡SINTONIZADO!`, '#34d399', true);

      await wait(1600);
      onVictory(playerSpirit, barbara, { ...enemySpirit, currentHp: enemySpirit.maxHp });
    } else {
      sound.playCancel();
      addLog(`¡Oh no! El espíritu rompió la resonancia y continúa en guardia.`, 'info');
      addFloatingText(`¡ESCAPÓ!`, '#fbbf24', true);

      await wait(900);
      enemyTurn(playerSpirit, enemySpirit);
    }
  };

  // Enemy Turn Action
  const enemyTurn = async (currPlayer: SpiritCreature, currEnemy: SpiritCreature) => {
    if (currEnemy.currentHp <= 0) return;

    // Pick random move
    const skill = currEnemy.skills[Math.floor(Math.random() * currEnemy.skills.length)] || {
      id: 'placaje',
      name: 'Placaje Físico',
      element: 'normal',
      power: 20,
      mpCost: 0
    };

    playElementSfx(skill.element as ElementType);
    triggerElementalVfx(skill.element as ElementType, false, skill.name);

    await wait(400);

    const { multiplier } = getElementalMultiplier(skill.element as ElementType, currPlayer.primaryElement);
    const baseDamage = Math.round(
      ((2 * currEnemy.level / 5 + 2) * skill.power * (currEnemy.attack / Math.max(1, currPlayer.defense)) / 50 + 2) * multiplier
    );
    const damage = Math.max(3, Math.round(baseDamage * (0.85 + Math.random() * 0.3)));

    setPlayerHitFlash(true);
    sound.playHit();

    addFloatingText(`-${damage}`, '#ef4444', false);
    addLog(`¡El rival ${currEnemy.name} atacó con ${skill.name} causando ${damage} de daño!`, 'damage');

    const nextPlayerHp = Math.max(0, currPlayer.currentHp - damage);
    const updatedPlayer = { ...currPlayer, currentHp: nextPlayerHp };
    setPlayerSpirit(updatedPlayer);

    await wait(600);
    setPlayerHitFlash(false);

    if (nextPlayerHp <= 0) {
      sound.playCancel();
      addLog(`¡Tu espíritu ${currPlayer.name} ha caído debilitado!`, 'critical');
      await wait(1200);
      onDefeat();
      return;
    }

    setIsAnimating(false);
    setActionCategory('main');
  };

  // Victory Sequence
  const handleVictorySequence = async (victorSpirit: SpiritCreature, defeatedEnemy: SpiritCreature) => {
    sound.stopBgm();
    sound.playLevelUp();

    const expGained = Math.round(defeatedEnemy.level * 45 * (isBossBattle ? 2.5 : 1));
    let nextExp = victorSpirit.exp + expGained;
    let nextLevel = victorSpirit.level;
    let maxExp = victorSpirit.maxExp;
    let leveledUp = false;

    addLog(`¡VICTORIA! Ganaste el combate y obtuviste ${expGained} EXP.`, 'info');

    // Check for newly unlocked moves by level up
    let updatedSkills = [...victorSpirit.skills];
    if (leveledUp) {
      const newMoves = checkNewMovesToLearn(victorSpirit, nextLevel);
      if (newMoves.length > 0) {
        newMoves.forEach(m => {
          if (!updatedSkills.some(s => s.id === m.id)) {
            updatedSkills.push(m);
            addLog(`✨ ¡${victorSpirit.name} aprendió el nuevo movimiento: ${m.name.toUpperCase()} (${m.element})!`, 'critical');
            addFloatingText(`¡NUEVA TÉCNICA!`, '#38bdf8', false);
          }
        });
      }
    }

    const updatedSpirit: SpiritCreature = {
      ...victorSpirit,
      level: nextLevel,
      exp: nextExp,
      maxExp,
      skills: updatedSkills,
      maxHp: victorSpirit.maxHp + (leveledUp ? 12 : 0),
      attack: victorSpirit.attack + (leveledUp ? 3 : 0),
      defense: victorSpirit.defense + (leveledUp ? 3 : 0),
      spAttack: victorSpirit.spAttack + (leveledUp ? 4 : 0),
      spDefense: victorSpirit.spDefense + (leveledUp ? 3 : 0),
      speed: victorSpirit.speed + (leveledUp ? 2 : 0),
    };

    // Award Barbara EXP & Gold
    const updatedBarbara: BarbaraHero = {
      ...barbara,
      gold: barbara.gold + (isBossBattle ? 250 : 60),
    };

    await wait(2200);
    onVictory(updatedSpirit, updatedBarbara);
  };

  const addLog = (text: string, type: BattleLogEntry['type']) => {
    setBattleLog(prev => [{ id: `log_${Date.now()}_${Math.random()}`, text, type }, ...prev.slice(0, 8)]);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* Enhanced Illustrated Battle Background per Region */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {regionId === 'villarrica' ? (
          // Villarrica: Volcanic Crater & Magma Grotto
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-red-950/70 to-orange-950/90">
            {/* Volcanic Silhouette */}
            <div className="absolute bottom-28 left-0 right-0 h-44 bg-[radial-gradient(ellipse_at_top,_#b91c1c_0%,_transparent_70%)] opacity-40 blur-md" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-orange-900/40 via-red-950/60 to-transparent border-t border-orange-500/20" />
            {/* Glowing Magma crack lines */}
            <div className="absolute bottom-6 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-xs opacity-75 animate-pulse" />
          </div>
        ) : regionId === 'hornopiren' ? (
          // Hornopirén: Glacial Fjord & Alerce Rain
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/60 to-slate-900">
            {/* Glacial Ice wall silhouette */}
            <div className="absolute bottom-20 left-0 right-0 h-52 bg-[radial-gradient(ellipse_at_top,_#0891b2_0%,_transparent_70%)] opacity-30 blur-md" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-cyan-950/60 via-slate-950/80 to-transparent border-t border-cyan-400/20" />
            {/* Ice crystal glimmer */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl animate-pulse" />
          </div>
        ) : regionId === 'pucon' ? (
          // Pucón: Lake Villarrica & Ancient Valdivian Forest
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-sky-950/60 to-emerald-950/80">
            {/* Lake water sheen */}
            <div className="absolute bottom-24 left-0 right-0 h-44 bg-[radial-gradient(ellipse_at_top,_#0284c7_0%,_transparent_70%)] opacity-35 blur-md" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-emerald-950/70 via-sky-950/60 to-transparent border-t border-sky-400/20" />
            <div className="absolute bottom-10 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-40 animate-pulse" />
          </div>
        ) : (
          // Santiago: San Cristóbal & Central Valley
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-900">
            {/* Andes silhouette glow */}
            <div className="absolute bottom-24 left-0 right-0 h-44 bg-[radial-gradient(ellipse_at_top,_#15803d_0%,_transparent_70%)] opacity-30 blur-md" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-slate-900/80 via-emerald-950/50 to-transparent border-t border-emerald-500/20" />
          </div>
        )}

        {/* Dynamic elemental floating chaos/spark particles */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Floating Combat Texts */}
      {floatingTexts.map(f => (
        <div
          key={f.id}
          className={`absolute z-40 font-silkscreen text-base md:text-xl font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-out fade-out slide-out-to-top duration-1000 ${
            f.isEnemy ? 'top-28 right-20 md:right-36' : 'bottom-48 left-20 md:left-36'
          }`}
          style={{ color: f.color }}
        >
          {f.text}
        </div>
      ))}

      {/* Top Header & Turn Timeline */}
      <div className="relative z-10 w-full p-3 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex justify-between items-center text-xs">
        <div className="flex items-center gap-3">
          <div className="font-silkscreen text-[11px] text-emerald-400 flex items-center gap-1.5">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>BATALLA TÁCTICA</span>
          </div>
          {isBossBattle && (
            <span className="px-2 py-0.5 bg-red-950/80 border border-red-500/60 rounded text-[10px] text-red-300 font-bold uppercase tracking-wider animate-pulse font-silkscreen">
              ¡GUARDIÁN ANCESTRAL!
            </span>
          )}
        </div>

        {/* Barbara Limit Break Gauge */}
        <div className="flex items-center gap-2">
          <span className="font-silkscreen text-[10px] text-amber-300">INVOCACIÓN:</span>
          <div className="w-24 md:w-36 h-3 bg-slate-900 border border-amber-500/40 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                barbara.limitGauge >= 100 
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-amber-600 to-amber-400'
              }`}
              style={{ width: `${barbara.limitGauge}%` }}
            />
          </div>
          <span className="font-mono-stat text-[10px] text-amber-300 tabular-nums font-bold">
            {Math.round(barbara.limitGauge)}%
          </span>
        </div>
      </div>

      {/* Battle Playfield Stage */}
      <div className="relative z-10 flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col justify-around">
        {/* ENEMY ROW (Top-Right) */}
        <div className="flex justify-end items-center pr-4 md:pr-12">
          {/* Enemy Info Card */}
          <div className="bg-slate-900/90 border-2 border-slate-700/80 p-3 rounded-xl shadow-xl w-60 md:w-72 mr-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-silkscreen text-xs text-white truncate max-w-[150px]">{enemySpirit.name}</span>
              <span className="font-mono-stat text-xs text-amber-400 font-bold">Nv. {enemySpirit.level}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getElementBadge(enemySpirit.primaryElement)}
              {enemySpirit.secondaryElement && getElementBadge(enemySpirit.secondaryElement)}
            </div>
            {/* Enemy HP */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono-stat mb-1">
              <span className="text-red-400 font-bold">PS</span>
              <div className="flex-1 h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    enemySpirit.currentHp / enemySpirit.maxHp < 0.25 
                      ? 'bg-red-500' 
                      : enemySpirit.currentHp / enemySpirit.maxHp < 0.5 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(enemySpirit.currentHp / enemySpirit.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-slate-300 tabular-nums text-[10px]">
                {enemySpirit.currentHp}/{enemySpirit.maxHp}
              </span>
            </div>

            {/* Enemy MP */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono-stat">
              <span className="text-cyan-400 font-bold">PM</span>
              <div className="flex-1 h-2 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(enemySpirit.currentMp / enemySpirit.maxMp) * 100}%` }}
                />
              </div>
              <span className="text-slate-300 tabular-nums text-[10px]">
                {enemySpirit.currentMp}/{enemySpirit.maxMp}
              </span>
            </div>
          </div>

          {/* Enemy Sprite & VFX Container */}
          <div className={`relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center ${enemyHitFlash ? 'brightness-200 contrast-200' : ''}`}>
            <canvas ref={enemyCanvasRef} width={160} height={160} className="w-full h-full object-contain image-render-pixel" />

            {/* Elemental Attack Effect Overlay over Enemy */}
            {activeAttackEffect && activeAttackEffect.isTargetEnemy && (
              <AttackVfx element={activeAttackEffect.element} skillName={activeAttackEffect.skillName} />
            )}
          </div>
        </div>

        {/* PLAYER ROW (Bottom-Left) */}
        <div className="flex justify-start items-center pl-4 md:pl-12">
          {/* Player Active Spirit Sprite + Barbara Badge */}
          <div className={`relative w-32 h-32 md:w-44 md:h-44 flex items-center justify-center mr-4 ${playerHitFlash ? 'brightness-200 contrast-200' : ''}`}>
            <canvas ref={playerCanvasRef} width={160} height={160} className="w-full h-full object-contain image-render-pixel" />
            
            {/* Elemental Attack Effect Overlay over Player */}
            {activeAttackEffect && !activeAttackEffect.isTargetEnemy && (
              <AttackVfx element={activeAttackEffect.element} skillName={activeAttackEffect.skillName} />
            )}

            <div className="absolute -bottom-2 -left-2 px-2 py-0.5 bg-emerald-950/90 border border-emerald-500/60 rounded-md text-[10px] font-mono-stat text-emerald-300 flex items-center gap-1">
              <span>🎒 Bárbara ({JOBS_CONFIG[barbara.job]?.name})</span>
            </div>
          </div>

          {/* Player Info Card */}
          <div className="bg-slate-900/90 border-2 border-emerald-500/60 p-3 rounded-xl shadow-xl w-64 md:w-80">
            <div className="flex justify-between items-center mb-1">
              <span className="font-silkscreen text-xs text-white truncate max-w-[160px]">{playerSpirit.name}</span>
              <span className="font-mono-stat text-xs text-emerald-400 font-bold">Nv. {playerSpirit.level}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {getElementBadge(playerSpirit.primaryElement)}
              {playerSpirit.secondaryElement && getElementBadge(playerSpirit.secondaryElement)}
            </div>

            {/* Player HP */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono-stat mb-1.5">
              <span className="text-red-400 font-bold">PS</span>
              <div className="flex-1 h-2.5 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    playerSpirit.currentHp / playerSpirit.maxHp < 0.25 
                      ? 'bg-red-500' 
                      : playerSpirit.currentHp / playerSpirit.maxHp < 0.5 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(playerSpirit.currentHp / playerSpirit.maxHp) * 100}%` }}
                />
              </div>
              <span className="text-slate-300 tabular-nums text-[10px]">
                {playerSpirit.currentHp}/{playerSpirit.maxHp}
              </span>
            </div>

            {/* Player MP */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono-stat">
              <span className="text-cyan-400 font-bold">PM</span>
              <div className="flex-1 h-2 bg-slate-950 border border-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${(playerSpirit.currentMp / playerSpirit.maxMp) * 100}%` }}
                />
              </div>
              <span className="text-slate-300 tabular-nums text-[10px]">
                {playerSpirit.currentMp}/{playerSpirit.maxMp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Command Console & Combat Log */}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-3">
        {/* Battle Log Box */}
        <div className="flex-1 bg-slate-950/90 border border-slate-800 rounded-2xl p-3 h-32 md:h-40 overflow-y-auto font-ui text-xs space-y-1 shadow-inner">
          {battleLog.map(log => (
            <div 
              key={log.id} 
              className={`leading-tight ${
                log.type === 'damage' ? 'text-rose-400' :
                log.type === 'heal' ? 'text-emerald-400' :
                log.type === 'critical' ? 'text-amber-300 font-bold' :
                log.type === 'capture' ? 'text-cyan-300' :
                log.type === 'status' ? 'text-yellow-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {log.text}
            </div>
          ))}
        </div>

        {/* Action Selection Grid */}
        <div className="w-full md:w-96 bg-slate-900/95 border-2 border-slate-700 rounded-2xl p-3 flex flex-col justify-between shadow-2xl">
          {/* Active Monster Avatar Header atop Action Buttons per user request */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-emerald-500/50 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner relative">
                <canvas 
                  ref={actionAvatarCanvasRef} 
                  width={48} 
                  height={48} 
                  className="w-full h-full object-contain image-render-pixel"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-silkscreen text-xs text-white truncate max-w-[140px]">{playerSpirit.name}</span>
                  <span className="text-[9px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold">
                    Nv. {playerSpirit.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                  <span className="text-emerald-400 font-bold">{playerSpirit.currentHp}/{playerSpirit.maxHp} PS</span>
                  <span>&middot;</span>
                  <span className="text-cyan-400 font-bold">{playerSpirit.currentMp}/{playerSpirit.maxMp} PM</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-silkscreen uppercase">
                {actionCategory === 'main' ? 'ACCIONES' : actionCategory === 'skills' ? 'TÉCNICAS' : actionCategory === 'barbara_skills' ? 'BÁRBARA' : actionCategory}
              </span>
              <div className="text-[9px] font-mono text-amber-300/90 mt-0.5">
                Bárbara: {barbara.currentMp} PM
              </div>
            </div>
          </div>

          {/* 1. MAIN ACTIONS MENU */}
          {actionCategory === 'main' && (
            <div className="grid grid-cols-2 gap-2 h-full">
              <button
                disabled={isAnimating}
                onClick={() => {
                  sound.playSelect();
                  setActionCategory('skills');
                }}
                className="p-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>LUCHAR</span>
              </button>

              <button
                disabled={isAnimating}
                onClick={() => {
                  sound.playSelect();
                  setActionCategory('barbara_skills');
                }}
                className="p-2.5 bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>BÁRBARA</span>
              </button>

              <button
                disabled={isAnimating || partySpirits.length <= 1}
                onClick={() => {
                  sound.playSelect();
                  setActionCategory('party_switch');
                }}
                className="p-2.5 bg-gradient-to-r from-violet-700 to-purple-800 hover:from-violet-600 hover:to-purple-700 disabled:opacity-40 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                title="Cambiar al espíritu activo del combate"
              >
                <Users className="w-3.5 h-3.5 text-purple-300" />
                <span>EQUIPO</span>
              </button>

              <button
                disabled={isAnimating || (inventory.orbe_resonancia?.count || 0) <= 0}
                onClick={handleCapture}
                className="p-2.5 bg-gradient-to-r from-sky-700 to-blue-700 hover:from-sky-600 hover:to-blue-600 disabled:opacity-50 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
                title={`Capturar espíritu silvestre (${inventory.orbe_resonancia?.count || 0} orbes disponibles)`}
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-300" />
                <span>SINTONIZAR</span>
              </button>

              <button
                disabled={isAnimating}
                onClick={() => {
                  sound.playCancel();
                  setActionCategory('confirm_flee');
                }}
                className="col-span-2 p-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg transition-all"
              >
                <span>🏃 HUIR DEL COMBATE</span>
              </button>

              {/* Full Invocación Button if meter is full (1 use per charge) */}
              {barbara.limitGauge >= 100 && (
                <button
                  disabled={isAnimating}
                  onClick={handleNatureSummon}
                  className="col-span-2 p-2.5 bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:brightness-110 text-white font-silkscreen text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-amber-950 animate-pulse cursor-pointer border border-amber-300"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>¡INVOCACIÓN PRIMIGENIA! (1 USO)</span>
                </button>
              )}
            </div>
          )}

          {/* 1.5 PARTY SWITCH MENU */}
          {actionCategory === 'party_switch' && (
            <div className="flex flex-col justify-between h-full space-y-2">
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <div className="text-[10px] font-silkscreen text-purple-300 mb-1 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>SELECCIONA RELEVO EN COMBATE:</span>
                </div>
                {partySpirits.map(spirit => {
                  const isActive = spirit.uid === playerSpirit.uid;
                  const isFainted = spirit.currentHp <= 0;
                  return (
                    <button
                      key={spirit.uid}
                      disabled={isActive || isFainted || isAnimating}
                      onClick={() => handleSwitchSpirit(spirit.uid)}
                      className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-purple-950/60 border-purple-500/70 text-purple-200'
                          : isFainted
                          ? 'bg-slate-900 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="font-silkscreen text-[11px] flex items-center gap-1.5">
                          <span>{spirit.name}</span>
                          <span className="text-[9px] text-amber-400">Nv.{spirit.level}</span>
                          {isActive && <span className="text-[9px] px-1 bg-purple-500/30 text-purple-300 rounded">ACTUAL</span>}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          PS: {spirit.currentHp}/{spirit.maxHp} &middot; Elemento: {spirit.primaryElement}
                        </div>
                      </div>
                      <span className="font-silkscreen text-[10px] text-cyan-400">
                        {isActive ? '●' : isFainted ? 'K.O.' : 'ENVIAR ➔'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  sound.playCancel();
                  setActionCategory('main');
                }}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-xs font-silkscreen cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>VOLVER</span>
              </button>
            </div>
          )}

          {/* 2. SKILLS MENU */}
          {actionCategory === 'skills' && (
            <div className="flex flex-col justify-between h-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {playerSpirit.skills.slice(0, 4).map(skill => (
                  <button
                    key={skill.id}
                    disabled={isAnimating || playerSpirit.currentMp < skill.mpCost}
                    onClick={() => handleSpiritSkill(skill)}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 rounded-xl text-left cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="font-silkscreen text-[11px] text-white truncate">{skill.name}</div>
                    <div className="flex justify-between items-center text-[10px] font-mono-stat mt-1">
                      <span className="text-amber-400">Pot: {skill.power}</span>
                      <span className="text-cyan-400">{skill.mpCost} PM</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  sound.playCancel();
                  setActionCategory('main');
                }}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-xs font-silkscreen cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>VOLVER</span>
              </button>
            </div>
          )}

          {/* 3. BARBARA JOB SPECIALS */}
          {actionCategory === 'barbara_skills' && (
            <div className="flex flex-col justify-between h-full space-y-2">
              <div className="space-y-1.5">
                <button
                  disabled={isAnimating || barbara.currentMp < 8}
                  onClick={() => handleBarbaraSkill('heal')}
                  className="w-full p-2 bg-emerald-950/70 hover:bg-emerald-900/80 disabled:opacity-40 border border-emerald-500/50 rounded-xl text-left cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-silkscreen text-[11px] text-emerald-300 flex items-center gap-1.5">
                      <span>Ungüento de Matico</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1 rounded">8 PM</span>
                    </div>
                    <div className="text-[10px] font-ui text-slate-300">Cura 90 PS al espíritu activo</div>
                  </div>
                  <Heart className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  disabled={isAnimating || barbara.currentMp < 10}
                  onClick={() => handleBarbaraSkill('barrier')}
                  className="w-full p-2 bg-sky-950/70 hover:bg-sky-900/80 border border-sky-500/50 disabled:opacity-40 rounded-xl text-left cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-silkscreen text-[11px] text-sky-300 flex items-center gap-1.5">
                      <span>Manto de Coigüe</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1 rounded">10 PM</span>
                    </div>
                    <div className="text-[10px] font-ui text-slate-300">Aumenta Defensa +40%</div>
                  </div>
                  <Shield className="w-4 h-4 text-sky-400" />
                </button>

                <button
                  disabled={isAnimating || barbara.currentMp < 25}
                  onClick={() => handleBarbaraSkill('synthesis')}
                  className="w-full p-2 bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/50 disabled:opacity-40 rounded-xl text-left cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-silkscreen text-[11px] text-amber-300 flex items-center gap-1.5">
                      <span>Fusión Elemental</span>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1 rounded">25 PM</span>
                    </div>
                    <div className="text-[10px] font-ui text-slate-300">Ataque directo de 85 de daño</div>
                  </div>
                  <Zap className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              <button
                onClick={() => {
                  sound.playCancel();
                  setActionCategory('main');
                }}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 text-xs font-silkscreen cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>VOLVER</span>
              </button>
            </div>
          )}

          {/* 4. CONFIRM FLEE */}
          {actionCategory === 'confirm_flee' && (
            <div className="flex flex-col justify-between h-full p-2 text-center space-y-2">
              <div className="space-y-1">
                <div className="font-silkscreen text-xs text-rose-400">¿RETIRARSE DEL COMBATE?</div>
                <p className="text-[11px] font-ui text-slate-300">
                  {isBossBattle 
                    ? 'Es un guardián colosal, pero puedes replegarte al campamento para entrenar.'
                    : 'Escaparás de forma segura manteniendo la posición de Bárbara en el mapa.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActionCategory('main')}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-silkscreen text-[10px] text-slate-300 cursor-pointer"
                >
                  CONTINUAR
                </button>
                <button
                  onClick={() => {
                    sound.playCancel();
                    onFlee();
                  }}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl font-silkscreen text-[10px] text-white cursor-pointer shadow-lg shadow-rose-950"
                >
                  HUIR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. ENCOUNTER INTRO OVERLAY (Enemy Sprite + Dialogue Prompt) per user request */}
      {showEncounterIntro && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col items-center text-center gap-4">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-silkscreen">
              {isBossBattle ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-300 font-bold">¡ALERTA DE JEFE ANCESTRAL!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ENCUENTRO SALVAJE</span>
                </>
              )}
            </div>

            {/* Large Animated Enemy Sprite Canvas */}
            <div className="relative w-36 h-36 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center p-2 shadow-inner">
              <canvas ref={introCanvasRef} width={180} height={180} className="w-32 h-32 object-contain image-render-pixel" />
            </div>

            {/* Enemy Identity */}
            <div>
              <h2 className="font-silkscreen text-lg text-white font-bold mb-1">
                {enemySpirit.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs font-mono-stat text-slate-400">
                <span className="text-amber-400 font-bold">Nivel {enemySpirit.level}</span>
                <span>&middot;</span>
                {getElementBadge(enemySpirit.primaryElement)}
              </div>
            </div>

            {/* Intro Dialogue Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs font-ui text-slate-300 leading-relaxed text-left w-full space-y-2">
              <div className="font-silkscreen text-[11px] text-amber-300">
                {isBossBattle ? `Guardián: ${enemySpirit.name}` : `Espíritu Silvestre (${enemySpirit.name})`}
              </div>
              <p className="italic text-slate-200">
                {isBossBattle 
                  ? '"¡Mortal insensata! Las raíces y el fuego sagrado de este santuario no cederán ante tu audacia. ¡Demuestra si tu espíritu es digno del equilibrio natural!"'
                  : `"${enemySpirit.lore}"`}
              </p>
            </div>

            {/* Start Combat Button */}
            <button
              onClick={() => {
                sound.playConfirm();
                setShowEncounterIntro(false);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:brightness-110 text-white font-silkscreen text-xs rounded-xl shadow-xl shadow-emerald-950 cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/50"
            >
              <Swords className="w-4 h-4 text-emerald-200" />
              <span>¡ENTRAR AL COMBATE! [ESPACIO]</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. PRIMAL SUMMON FULLSCREEN CINEMATIC ANIMATION (1-USE LIMIT BREAK) */}
      {activeSummonCinematic && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="relative flex flex-col items-center max-w-lg w-full">
            {/* Multi-layered elemental summon vortex */}
            <div className="absolute -inset-16 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-purple-500/30 animate-spin blur-2xl pointer-events-none" />
            <div className="absolute -inset-8 rounded-full border-4 border-dashed border-amber-300/60 animate-spin blur-xs pointer-events-none" />
            
            {/* Primal Sacred Emblem */}
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-red-600/30 border-2 border-amber-300 flex items-center justify-center mb-6 shadow-[0_0_60px_#f59e0b] animate-bounce">
              <Sparkles className="w-14 h-14 text-amber-300 animate-spin" />
            </div>

            {/* Radiant Shockwave Beam */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent blur-xs animate-ping" />

            <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-silkscreen mb-3 shadow-lg shadow-amber-950">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>PODER PRIMIGENIO DESATADO &middot; LÍMITE SUPREMO</span>
            </div>

            <h2 className="relative z-10 font-heading text-xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 font-bold mb-2 tracking-wide drop-shadow-[0_4px_20px_rgba(251,191,36,0.8)]">
              {activeSummonCinematic.name.toUpperCase()}
            </h2>

            <p className="relative z-10 font-ui text-sm text-slate-200 max-w-md mx-auto italic mt-2 bg-slate-900/60 p-3 rounded-2xl border border-amber-500/30">
              "Los espíritus tutelares de la cordillera, lagos y bosques australes responden al llamado sincero de Bárbara, canalizando la fuerza pura de la tierra."
            </p>

            <div className="relative z-10 mt-6 flex items-center gap-2 text-xs font-mono-stat text-amber-300 bg-amber-950/80 px-4 py-2 rounded-full border border-amber-400/50">
              <span>💥 160 DAÑO CATACLÍSMICO + 💚 CURACIÓN TOTAL DEL EQUIPO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Elemental Attack VFX Helper (Renders rich particle & slash animations over sprite)
const AttackVfx: React.FC<{ element: ElementType; skillName: string }> = ({ element, skillName }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center animate-in zoom-in-75 duration-200">
      {element === 'fuego' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-orange-500/30 animate-ping" />
          <div className="absolute w-20 h-2.5 bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 rotate-45 transform shadow-[0_0_15px_#f97316] animate-pulse" />
          <div className="absolute w-20 h-2.5 bg-gradient-to-r from-yellow-300 via-orange-500 to-red-600 -rotate-45 transform shadow-[0_0_15px_#f97316] animate-pulse" />
          <div className="absolute font-silkscreen text-[9px] text-orange-300 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-orange-500/50 shadow">
            🔥 {skillName}
          </div>
        </div>
      )}
      {element === 'agua' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border-4 border-sky-400 animate-ping opacity-75" />
          <div className="absolute w-24 h-24 rounded-full bg-cyan-500/25 blur-sm" />
          <div className="absolute w-3 h-20 bg-gradient-to-t from-sky-400 to-cyan-100 rotate-12 rounded-full shadow-[0_0_12px_#38bdf8]" />
          <div className="absolute font-silkscreen text-[9px] text-sky-300 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/50 shadow">
            💧 {skillName}
          </div>
        </div>
      )}
      {(element === 'planta' || element === 'tierra') && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-emerald-500/30 animate-ping" />
          <div className="absolute w-24 h-3 bg-gradient-to-r from-emerald-300 via-green-500 to-emerald-800 -rotate-30 rounded-full shadow-[0_0_12px_#10b981]" />
          <div className="absolute w-16 h-2 bg-gradient-to-r from-lime-300 to-green-600 rotate-60 rounded-full shadow-[0_0_10px_#84cc16]" />
          <div className="absolute font-silkscreen text-[9px] text-emerald-300 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/50 shadow">
            🌿 {skillName}
          </div>
        </div>
      )}
      {element === 'viento' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border-2 border-teal-300/80 animate-spin" />
          <div className="absolute w-20 h-2 bg-gradient-to-r from-teal-200 via-white to-cyan-400 rotate-45 shadow-[0_0_15px_#2dd4bf]" />
          <div className="absolute font-silkscreen text-[9px] text-teal-300 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-teal-500/50 shadow">
            🌪️ {skillName}
          </div>
        </div>
      )}
      {element === 'hielo' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-cyan-200/20 rotate-45 border-2 border-cyan-300 animate-pulse" />
          <div className="absolute w-20 h-20 bg-sky-200/20 -rotate-45 border-2 border-sky-300" />
          <div className="absolute font-silkscreen text-[9px] text-cyan-200 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-cyan-500/50 shadow">
            ❄️ {skillName}
          </div>
        </div>
      )}
      {element === 'sagrado' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full bg-amber-400/30 animate-ping" />
          <div className="absolute w-12 h-36 bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 rounded-full shadow-[0_0_25px_#facc15] blur-xs" />
          <div className="absolute font-silkscreen text-[9px] text-amber-300 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/50 shadow">
            ✨ {skillName}
          </div>
        </div>
      )}
      {element === 'normal' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-24 h-2 bg-white rotate-45 shadow-[0_0_12px_#ffffff]" />
          <div className="absolute w-24 h-2 bg-white -rotate-45 shadow-[0_0_12px_#ffffff]" />
          <div className="absolute font-silkscreen text-[9px] text-slate-200 font-bold -top-4 bg-slate-950/90 px-2 py-0.5 rounded border border-slate-600 shadow">
            ⚔️ {skillName}
          </div>
        </div>
      )}
    </div>
  );
};
