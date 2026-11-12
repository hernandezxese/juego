/**
 * Bárbara: Crónicas Elementales del Sur
 * Inspired by Pokémon FireRed & Final Fantasy III
 * Main Game State Controller & Shell
 * Supports Save / Load, Reset Game, Low Testing Levels, Linear Stage Entrances, and Quests
 */

import React, { useState, useEffect } from 'react';
import { 
  GameState, 
  RegionId, 
  SpiritCreature, 
  BarbaraHero, 
  InventoryItem, 
  JobClass 
} from './types/game';
import { REGIONS_DATA } from './data/regionsData';
import { createSpiritInstance } from './data/spiritsData';
import { INITIAL_ITEMS, JOBS_CONFIG } from './data/itemsData';
import { sound } from './services/audioService';
import { storageService } from './services/storageService';

import { TitleScreen } from './components/TitleScreen';
import { ExplorationView } from './components/ExplorationView';
import { BattleView } from './components/BattleView';
import { EvolutionSanctuary } from './components/EvolutionSanctuary';
import { PartyMenu } from './components/PartyMenu';
import { WorldMapModal } from './components/WorldMapModal';
import { InventoryModal } from './components/InventoryModal';
import { ShopModal } from './components/ShopModal';
import { BestiaryModal } from './components/BestiaryModal';
import { DialogueBox } from './components/DialogueBox';
import { StarterSelectModal } from './components/StarterSelectModal';
import { Sparkles, Trophy, RotateCcw, Save, CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  // Game Flow State
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentRegionId, setCurrentRegionId] = useState<RegionId>('santiago');
  const [unlockedRegions, setUnlockedRegions] = useState<RegionId[]>(['santiago']);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [hasSave, setHasSave] = useState<boolean>(storageService.hasSavedGame());

  // Linear stage entrance spawn position
  const [playerSpawnPos, setPlayerSpawnPos] = useState<{ x: number; y: number }>({ x: 10, y: 6 });

  // Starter Selection State
  const [showStarterSelect, setShowStarterSelect] = useState(false);

  // Notification Toast & Reset Confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Barbara Hero State
  const [barbara, setBarbara] = useState<BarbaraHero>({
    name: 'Bárbara',
    level: 1,
    exp: 0,
    maxExp: 100,
    currentHp: 120,
    maxHp: 120,
    currentMp: 60,
    maxMp: 60,
    job: 'naturalista',
    jobMastery: { naturalista: 1, chaman: 1, guardaparque: 1, mistica: 1 },
    limitGauge: 20,
    resonanceOrbs: 8,
    gold: 200,
    activeSpiritUids: [],
  });

  // Party Spirits (Starting with chosen starter)
  const [partySpirits, setPartySpirits] = useState<SpiritCreature[]>([
    createSpiritInstance('brotin', 2, 1),
    createSpiritInstance('chucao', 1, 1)
  ]);

  // Inventory
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>(INITIAL_ITEMS);

  // Active Battle Encounter State
  const [activeEnemySpirit, setActiveEnemySpirit] = useState<SpiritCreature | null>(null);
  const [isBossBattle, setIsBossBattle] = useState(false);
  const [activeEncounterEntityId, setActiveEncounterEntityId] = useState<string | null>(null);

  // Active Dialogue State
  const [activeDialogue, setActiveDialogue] = useState<{ speaker: string; lines: string[] } | null>(null);

  // Trigger floating toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  // Start New Game from Title: Open starter selection
  const handleStartGame = () => {
    setShowStarterSelect(true);
  };

  // Handle Starter Choice
  const handleSelectStarter = (chosenSpirit: SpiritCreature) => {
    setPartySpirits([
      chosenSpirit,
      createSpiritInstance(chosenSpirit.baseId === 'chucao' ? 'brotin' : 'chucao', 1, 1)
    ]);
    setShowStarterSelect(false);
    setPlayerSpawnPos({ x: 10, y: 6 });
    setGameState('exploration');
    sound.playBgm('santiago');
    showToast(`✨ ¡${chosenSpirit.name} se ha unido a Bárbara como tu compañero inicial!`);
  };

  // Save Game to LocalStorage
  const handleSaveGame = () => {
    // Collect all cleared entity IDs across regions
    const clearedIds: string[] = [];
    Object.values(REGIONS_DATA).forEach(reg => {
      reg.entities.forEach(ent => {
        if (ent.cleared) clearedIds.push(ent.id);
      });
    });

    const success = storageService.saveGame({
      currentRegionId,
      unlockedRegions,
      barbara,
      partySpirits,
      inventory,
      clearedEntityIds: clearedIds,
      playerSpawnPos,
    });

    if (success) {
      setHasSave(true);
      showToast('💾 ¡Partida guardada exitosamente en la memoria!');
    }
  };

  // Load Game from LocalStorage
  const handleLoadGame = () => {
    const data = storageService.loadGame();
    if (!data) return;

    setCurrentRegionId(data.currentRegionId);
    setUnlockedRegions(data.unlockedRegions);
    setBarbara(data.barbara);
    setPartySpirits(data.partySpirits);
    setInventory(data.inventory);
    if (data.playerSpawnPos) setPlayerSpawnPos(data.playerSpawnPos);

    // Restore cleared flags on entities
    Object.values(REGIONS_DATA).forEach(reg => {
      reg.entities.forEach(ent => {
        if (data.clearedEntityIds.includes(ent.id)) {
          ent.cleared = true;
        }
      });
    });

    setGameState('exploration');
    sound.playBgm(data.currentRegionId);
    showToast('📂 ¡Partida cargada exitosamente!');
  };

  // Reset Game
  const handleConfirmReset = () => {
    storageService.resetGame();
    setHasSave(false);
    setShowResetConfirm(false);

    // Reset Barbara and party
    setBarbara({
      name: 'Bárbara',
      level: 1,
      exp: 0,
      maxExp: 100,
      currentHp: 120,
      maxHp: 120,
      currentMp: 60,
      maxMp: 60,
      job: 'naturalista',
      jobMastery: { naturalista: 1, chaman: 1, guardaparque: 1, mistica: 1 },
      limitGauge: 20,
      resonanceOrbs: 8,
      gold: 200,
      activeSpiritUids: [],
    });

    setInventory(INITIAL_ITEMS);
    setCurrentRegionId('santiago');
    setUnlockedRegions(['santiago']);
    setPlayerSpawnPos({ x: 10, y: 6 });

    // Reset cleared flags on entities
    Object.values(REGIONS_DATA).forEach(reg => {
      reg.entities.forEach(ent => {
        ent.cleared = false;
      });
    });

    // Open starter choice for clean reset
    setShowStarterSelect(true);
    showToast('🔄 ¡Partida reiniciada! Escoge tu espíritu inicial.');
  };

  // Trigger Overworld Battle with low testing levels per user request (Preserving exact map position)
  const handleTriggerBattle = (enemySpiritId: string, isBoss: boolean, atPos?: { x: number; y: number }, entityId?: string) => {
    if (atPos) {
      setPlayerSpawnPos(atPos);
    }
    setActiveEncounterEntityId(entityId || null);

    // Low levels for practical testing
    const enemyLevel = isBoss 
      ? (currentRegionId === 'santiago' ? 3 : currentRegionId === 'pucon' ? 4 : currentRegionId === 'villarrica' ? 5 : 6)
      : (currentRegionId === 'santiago' ? 1 : currentRegionId === 'pucon' ? 2 : currentRegionId === 'villarrica' ? 3 : 4);

    const enemy = createSpiritInstance(enemySpiritId, enemyLevel, isBoss ? 2 : 1);
    
    // Scale down HP slightly for fast testing of combat, capture, and evolution
    enemy.maxHp = Math.round(enemy.maxHp * 0.75);
    enemy.currentHp = enemy.maxHp;

    setActiveEnemySpirit(enemy);
    setIsBossBattle(isBoss);
    setGameState('battle');
  };

  // Victory in Battle (Monsters disappear upon defeat/capture)
  const handleBattleVictory = (
    updatedPlayerSpirit: SpiritCreature, 
    updatedBarbara: BarbaraHero, 
    capturedSpirit?: SpiritCreature
  ) => {
    // If encounter was tied to an overworld entity, mark it cleared so it disappears
    if (activeEncounterEntityId) {
      const reg = REGIONS_DATA[currentRegionId];
      if (reg) {
        const ent = reg.entities.find(e => e.id === activeEncounterEntityId);
        if (ent) {
          ent.cleared = true;
        }
      }
      setActiveEncounterEntityId(null);
    }

    // Update player spirit
    setPartySpirits(prev => {
      const next = prev.map(s => s.uid === updatedPlayerSpirit.uid ? updatedPlayerSpirit : s);
      if (capturedSpirit) {
        next.push(capturedSpirit);
      }
      return next;
    });

    setBarbara(updatedBarbara);

    // If Boss Defeated, unlock next region or trigger endgame
    if (isBossBattle) {
      if (currentRegionId === 'santiago') {
        if (!unlockedRegions.includes('pucon')) {
          setUnlockedRegions(prev => [...prev, 'pucon']);
          setActiveDialogue({
            speaker: 'Don Ignacio',
            lines: [
              '¡Extraordinario trabajo Bárbara! Has purificado la energía del Cerro San Cristóbal.',
              'El camino hacia los lagos de Pucón y la selva valdiviana ha sido despejado.',
              '¡Cruza el portal sur o abre el Mapa de Chile para continuar tu travesía!'
            ]
          });
        }
      } else if (currentRegionId === 'pucon') {
        if (!unlockedRegions.includes('villarrica')) {
          setUnlockedRegions(prev => [...prev, 'villarrica']);
          setActiveDialogue({
            speaker: 'Rayén (Guardaparques)',
            lines: [
              '¡La Dama del Lago ha recuperado su brillo cristalino!',
              'Ahora debes ascender a las cavernas del Volcán Villarrica antes de que el fuego del Pillán consuma el bosque.',
              'Cruza el portal sur para entrar al cráter del volcán.'
            ]
          });
        }
      } else if (currentRegionId === 'villarrica') {
        if (!unlockedRegions.includes('hornopiren')) {
          setUnlockedRegions(prev => [...prev, 'hornopiren']);
          setActiveDialogue({
            speaker: 'Nahuel (Herrero Volcánico)',
            lines: [
              '¡Has dominado la furia del Pillán! Su fuego ahora arde en armonía.',
              'El destino final te aguarda en la Carretera Austral: los fiordos y los alerces milenarios de Hornopirén.',
              '¡Allí salvaremos el corazón de la naturaleza de Chile!'
            ]
          });
        }
      } else if (currentRegionId === 'hornopiren') {
        setGameState('victory');
        sound.playBgm('victory');
        return;
      }
    }

    setGameState('exploration');
  };

  // Defeat in Battle
  const handleBattleDefeat = () => {
    setPartySpirits(prev => prev.map(s => ({
      ...s,
      currentHp: Math.round(s.maxHp * 0.5),
      currentMp: Math.round(s.maxMp * 0.5)
    })));

    setActiveDialogue({
      speaker: 'Bárbara',
      lines: [
        'Uff... La fuerza elemental fue intensa.',
        'Nos replegamos al campamento para recuperar fuerzas. ¡Aprovecha la debilidad elemental del rival!'
      ]
    });

    setGameState('exploration');
  };

  // Evolution Trigger
  const handleEvolveSpirit = (spiritUid: string, nextStageNumber: number, usedItemKey?: string) => {
    setPartySpirits(prev => prev.map(s => {
      if (s.uid !== spiritUid) return s;
      const nextStageData = s.evolutionLine[nextStageNumber - 1];
      if (!nextStageData) return s;

      const newSkills = [...s.skills];
      if (!newSkills.some(sk => sk.id === nextStageData.signatureSkill.id)) {
        newSkills.unshift(nextStageData.signatureSkill);
      }

      return {
        ...s,
        currentStage: nextStageNumber,
        name: nextStageData.name,
        lore: nextStageData.description,
        maxHp: s.maxHp + 45,
        currentHp: s.maxHp + 45,
        maxMp: s.maxMp + 25,
        currentMp: s.maxMp + 25,
        attack: s.attack + 18,
        defense: s.defense + 18,
        spAttack: s.spAttack + 22,
        spDefense: s.spDefense + 18,
        speed: s.speed + 12,
        skills: newSkills,
      };
    }));

    if (usedItemKey) {
      setInventory(prev => ({
        ...prev,
        [usedItemKey]: {
          ...prev[usedItemKey],
          count: Math.max(0, prev[usedItemKey].count - 1)
        }
      }));
    }

    showToast('✨ ¡Evolución ancestral completada con éxito!');
  };

  // Change Barbara's Job Class (Final Fantasy III)
  const handleChangeJob = (newJob: JobClass) => {
    setBarbara(prev => ({
      ...prev,
      job: newJob
    }));
    showToast(`🛡️ ¡Bárbara cambió de clase a ${JOBS_CONFIG[newJob]?.name}!`);
  };

  // Set Party Leader
  const handleSetLeaderSpirit = (spiritUid: string) => {
    setPartySpirits(prev => {
      const idx = prev.findIndex(s => s.uid === spiritUid);
      if (idx <= 0) return prev;
      const clone = [...prev];
      const [item] = clone.splice(idx, 1);
      clone.unshift(item);
      return clone;
    });
    showToast('👑 ¡Nuevo espíritu líder asignado al combate!');
  };

  // Open Chest / Get reward
  const handleOpenChest = (entityId: string, itemReward?: { id: string; count: number }, gold?: number) => {
    const reg = REGIONS_DATA[currentRegionId];
    const ent = reg.entities.find(e => e.id === entityId);
    if (ent) ent.cleared = true;

    if (itemReward && inventory[itemReward.id]) {
      setInventory(prev => ({
        ...prev,
        [itemReward.id]: {
          ...prev[itemReward.id],
          count: prev[itemReward.id].count + itemReward.count
        }
      }));
    }

    if (gold) {
      setBarbara(prev => ({ ...prev, gold: prev.gold + gold }));
    }
  };

  // Clear Obstacle
  const handleClearObstacle = (entityId: string, message: string) => {
    const reg = REGIONS_DATA[currentRegionId];
    const ent = reg.entities.find(e => e.id === entityId);
    if (ent) ent.cleared = true;

    setActiveDialogue({
      speaker: 'Poder Elemental de la Naturaleza',
      lines: [message]
    });
  };

  // Use item from bag on spirit
  const handleUseItemOnSpirit = (itemId: string, targetUid: string) => {
    const item = inventory[itemId];
    if (!item || item.count <= 0) return;

    setPartySpirits(prev => prev.map(s => {
      if (s.uid !== targetUid) return s;
      if (item.effectType === 'heal_hp') {
        return { ...s, currentHp: Math.min(s.maxHp, s.currentHp + item.effectValue) };
      }
      if (item.effectType === 'heal_mp') {
        return { ...s, currentMp: Math.min(s.maxMp, s.currentMp + item.effectValue) };
      }
      if (item.effectType === 'revive') {
        return { ...s, currentHp: Math.max(s.currentHp, Math.round(s.maxHp * 0.5)) };
      }
      return s;
    }));

    setInventory(prev => ({
      ...prev,
      [itemId]: { ...item, count: item.count - 1 }
    }));

    showToast(`🍃 Objeto utilizado con éxito en tu espíritu.`);
  };

  // Linear Stage Movement (If player went down, appear at top; if went up, appear at bottom)
  const handleTravelPortal = (destRegion: RegionId, destX?: number, destY?: number) => {
    const spawnX = destX ?? 11;
    const spawnY = destY ?? 1;
    setPlayerSpawnPos({ x: spawnX, y: spawnY });
    setCurrentRegionId(destRegion);
    setGameState('exploration');
    sound.playBgm(destRegion);
  };

  // Fast travel from World Map
  const handleFastTravel = (targetRegion: RegionId) => {
    setPlayerSpawnPos({ x: 11, y: 7 }); // Center spawn for fast-travel
    setCurrentRegionId(targetRegion);
    setGameState('exploration');
    sound.playBgm(targetRegion);
  };

  const currentRegion = REGIONS_DATA[currentRegionId];
  const activeSpirit = partySpirits[0];

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 font-sans antialiased text-white overflow-hidden">
      {/* Scanline CRT aesthetic subtle overlay */}
      <div className="scanlines absolute inset-0 z-40 pointer-events-none opacity-40" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border-2 border-emerald-400 text-white px-4 py-2 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reset Game Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 max-w-md w-full shadow-2xl font-mono text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-rose-400 font-pixel text-sm mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span>¿REINICIAR TODA LA AVENTURA?</span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              Esta acción restablecerá todo tu progreso, espíritus, niveles e inventario. Volverás al inicio en Santiago.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold cursor-pointer shadow-lg shadow-rose-950"
              >
                Sí, Reiniciar Aventura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STARTER SELECTION MODAL */}
      {showStarterSelect && (
        <StarterSelectModal onSelectStarter={handleSelectStarter} />
      )}

      {/* 1. TITLE SCREEN */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onContinueGame={handleLoadGame}
          onResetGame={() => setShowResetConfirm(true)}
          hasSave={hasSave}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. EXPLORATION VIEW */}
      {gameState === 'exploration' && (
        <ExplorationView
          currentRegion={currentRegion}
          unlockedRegions={unlockedRegions}
          playerSpirit={activeSpirit}
          barbara={barbara}
          isMuted={isMuted}
          initialSpawnPos={playerSpawnPos}
          onToggleMute={handleToggleMute}
          onOpenParty={() => setGameState('party')}
          onOpenInventory={() => setGameState('inventory')}
          onOpenEvolution={() => setGameState('evolution')}
          onOpenShop={() => setGameState('shop')}
          onOpenBestiary={() => setGameState('bestiary')}
          onOpenMap={() => setGameState('map')}
          onSaveGame={handleSaveGame}
          onResetGame={() => setShowResetConfirm(true)}
          onTriggerDialogue={(speaker, lines) => setActiveDialogue({ speaker, lines })}
          onTriggerBattle={handleTriggerBattle}
          onClearObstacle={handleClearObstacle}
          onOpenChest={handleOpenChest}
          onTravelPortal={handleTravelPortal}
        />
      )}

      {/* 3. TACTICAL BATTLE VIEW */}
      {gameState === 'battle' && activeEnemySpirit && (
        <BattleView
          playerSpirit={activeSpirit}
          partySpirits={partySpirits}
          barbara={barbara}
          enemySpirit={activeEnemySpirit}
          isBossBattle={isBossBattle}
          inventory={inventory}
          regionThemeColor={currentRegion.themeColor}
          regionId={currentRegion.id}
          onVictory={handleBattleVictory}
          onDefeat={handleBattleDefeat}
          onFlee={() => setGameState('exploration')}
          onSwitchActiveSpirit={(newUid) => handleSetLeaderSpirit(newUid)}
          onUseItem={(itemId) => {
            if (inventory[itemId]) {
              setInventory(prev => ({
                ...prev,
                [itemId]: { ...prev[itemId], count: Math.max(0, prev[itemId].count - 1) }
              }));
            }
          }}
        />
      )}

      {/* 4. EVOLUTION SANCTUARY */}
      {gameState === 'evolution' && (
        <EvolutionSanctuary
          partySpirits={partySpirits}
          inventory={inventory}
          onEvolveSpirit={handleEvolveSpirit}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 5. PARTY & JOB CLASS MENU (FF3) */}
      {gameState === 'party' && (
        <PartyMenu
          partySpirits={partySpirits}
          barbara={barbara}
          onChangeJob={handleChangeJob}
          onSetLeaderSpirit={handleSetLeaderSpirit}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 6. INVENTORY MODAL */}
      {gameState === 'inventory' && (
        <InventoryModal
          inventory={inventory}
          partySpirits={partySpirits}
          onUseItemOnSpirit={handleUseItemOnSpirit}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 7. BOTICA & PROVISIONES SHOP */}
      {gameState === 'shop' && (
        <ShopModal
          barbara={barbara}
          inventory={inventory}
          onBuyItem={(itemId, quantity, totalCost) => {
            setBarbara(prev => ({ ...prev, gold: Math.max(0, prev.gold - totalCost) }));
            setInventory(prev => ({
              ...prev,
              [itemId]: {
                ...(prev[itemId] || INITIAL_ITEMS[itemId]),
                count: (prev[itemId]?.count || 0) + quantity
              }
            }));
            showToast(`✨ Adquiriste ${quantity}x ${INITIAL_ITEMS[itemId]?.name || itemId}`);
          }}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 8. BESTIARIO / POKÉDEX MODAL */}
      {gameState === 'bestiary' && (
        <BestiaryModal
          partySpirits={partySpirits}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 9. WORLD MAP MODAL */}
      {gameState === 'map' && (
        <WorldMapModal
          currentRegionId={currentRegionId}
          unlockedRegions={unlockedRegions}
          onFastTravel={handleFastTravel}
          onClose={() => setGameState('exploration')}
        />
      )}

      {/* 8. GRAND VICTORY MODAL (Endgame) */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/40">
            <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
          </div>

          <h1 className="font-pixel text-2xl sm:text-3xl text-amber-300 mb-3 drop-shadow-[0_4px_12px_rgba(251,191,36,0.5)]">
            ¡LA ARMONÍA DE CHILE HA SIDO RESTAURADA!
          </h1>
          <h2 className="font-cinzel text-lg text-emerald-400 font-bold mb-4">
            Bárbara &middot; Maestra de los Espíritus Elementales del Sur
          </h2>

          <div className="max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed mb-6 text-left">
            <p className="mb-3">
              Gracias a tu valentía y maestría táctica en combate, la Ceniza Umbría ha sido disipada para siempre de los cuatro rincones sagrados:
            </p>
            <ul className="space-y-1.5 text-emerald-300 mb-4 pl-4 list-disc">
              <li>El valle de Santiago y el Cerro San Cristóbal florecen en paz.</li>
              <li>Las aguas cristalinas y cascadas de Pucón cantan con vigor.</li>
              <li>El fuego ancestral del Volcán Villarrica arde en equilibrio.</li>
              <li>Los alerces milenarios y fiordos de Hornopirén custodian el latido eterno del sur.</li>
            </ul>
            <p className="text-slate-400">
              Bárbara sonríe mirando la cordillera nevada. Su viaje recién comienza, pero el mundo jamás olvidará tu leyenda.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playConfirm();
              setGameState('title');
              sound.playBgm('title');
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl font-pixel text-xs text-white shadow-xl shadow-emerald-950 cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>VOLVER A JUGAR</span>
          </button>
        </div>
      )}

      {/* OVERWORLD / SYSTEM DIALOGUE BOX */}
      {activeDialogue && (
        <DialogueBox
          speakerName={activeDialogue.speaker}
          lines={activeDialogue.lines}
          onComplete={() => setActiveDialogue(null)}
        />
      )}
    </div>
  );
}
