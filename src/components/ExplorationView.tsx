/**
 * 60fps Open-World Exploration View for Bárbara: Crónicas Elementales del Sur
 * Features:
 * - Smaller, retro-compact tile grid (TILE_SIZE = 32)
 * - Fluid continuous walking simulation with sub-pixel interpolation & leg cycles
 * - Clear Objective Tracker HUD (What to do next) + Guide Modal
 * - Objective waypoint beacon on target entities
 * - Smooth camera follow & virtual D-Pad with continuous press support
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MapRegion, SpiritCreature, BarbaraHero, OverworldEntity, RegionId } from '../types/game';
import { sound } from '../services/audioService';
import { drawBarbaraSprite, drawEntitySprite } from '../utils/pixelRenderer';
import { getCurrentQuest, isStageBossAwakened } from '../data/questData';
import { AdventureGuideModal } from './AdventureGuideModal';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Backpack, 
  Compass, 
  MapPin, 
  Swords, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Target,
  ArrowRight,
  Save,
  RotateCcw,
  X,
  Minimize2,
  Maximize2,
  ShoppingBag,
  Settings
} from 'lucide-react';

interface ExplorationViewProps {
  currentRegion: MapRegion;
  unlockedRegions: RegionId[];
  playerSpirit: SpiritCreature;
  barbara: BarbaraHero;
  isMuted: boolean;
  initialSpawnPos?: { x: number; y: number };
  onToggleMute: () => void;
  onOpenParty: () => void;
  onOpenInventory: () => void;
  onOpenEvolution: () => void;
  onOpenShop?: () => void;
  onOpenBestiary?: () => void;
  onOpenMap: () => void;
  onOpenSystemMenu?: () => void;
  onSaveGame?: () => void;
  onResetGame?: () => void;
  onTriggerDialogue: (speaker: string, lines: string[]) => void;
  onTriggerBattle: (enemySpiritId: string, isBoss: boolean, atPos?: { x: number; y: number }, entityId?: string) => void;
  onClearObstacle: (entityId: string, message: string) => void;
  onOpenChest: (entityId: string, itemReward?: { id: string; count: number }, gold?: number) => void;
  onTravelPortal: (destinationRegion: RegionId, destX?: number, destY?: number) => void;
}

export const ExplorationView: React.FC<ExplorationViewProps> = ({
  currentRegion,
  unlockedRegions,
  playerSpirit,
  barbara,
  isMuted,
  initialSpawnPos = { x: 7, y: 7 },
  onToggleMute,
  onOpenParty,
  onOpenInventory,
  onOpenEvolution,
  onOpenShop,
  onOpenBestiary,
  onOpenMap,
  onOpenSystemMenu,
  onSaveGame,
  onResetGame,
  onTriggerDialogue,
  onTriggerBattle,
  onClearObstacle,
  onOpenChest,
  onTravelPortal
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compact tile size per user request ("que los cuadros sean mas pequeños")
  const TILE_SIZE = 32;

  // Linear stage entrance positioning & continuous floating position
  const [playerGridPos, setPlayerGridPos] = useState(initialSpawnPos);
  const [playerDir, setPlayerDir] = useState<'down' | 'up' | 'left' | 'right'>(
    initialSpawnPos.y <= 3 ? 'down' : initialSpawnPos.y >= 10 ? 'up' : 'down'
  );
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showQuestBanner, setShowQuestBanner] = useState(true);
  const [interactPrompt, setInteractPrompt] = useState<string | null>(null);
  const [nearbyEntity, setNearbyEntity] = useState<OverworldEntity | null>(null);

  // Active Quest Step calculation
  const currentQuest = getCurrentQuest(currentRegion, unlockedRegions);

  // Mutable refs for high-frequency 60fps simulation
  const posRef = useRef({ x: initialSpawnPos.x, y: initialSpawnPos.y });
  const targetPosRef = useRef({ x: initialSpawnPos.x, y: initialSpawnPos.y });
  const dirRef = useRef<'down' | 'up' | 'left' | 'right'>(
    initialSpawnPos.y <= 3 ? 'down' : initialSpawnPos.y >= 10 ? 'up' : 'down'
  );
  const isMovingRef = useRef(false);
  const walkProgressRef = useRef(0);
  const footstepDistRef = useRef(0);
  const heldKeysRef = useRef<Set<string>>(new Set());

  // Update spawn pos when stage changes linearly
  useEffect(() => {
    posRef.current = { x: initialSpawnPos.x, y: initialSpawnPos.y };
    targetPosRef.current = { x: initialSpawnPos.x, y: initialSpawnPos.y };
    const facing = initialSpawnPos.y <= 3 ? 'down' : initialSpawnPos.y >= 10 ? 'up' : 'down';
    dirRef.current = facing;
    setPlayerDir(facing);
    setPlayerGridPos({ x: initialSpawnPos.x, y: initialSpawnPos.y });
  }, [initialSpawnPos.x, initialSpawnPos.y, currentRegion.id]);

  // Tile collision checking
  const isTileBlocked = useCallback((x: number, y: number): boolean => {
    if (x < 0 || x >= currentRegion.width || y < 0 || y >= currentRegion.height) return true;
    const tileType = currentRegion.tiles[y]?.[x];
    // 0: grass, 1: path, 6: snow/ice, 7: flowers are walkable
    // 2: water, 3: mountain, 4: dense tree, 5: lava are blocked
    if (tileType === 2 || tileType === 3 || tileType === 4 || tileType === 5) return true;

    // Check entity blockage
    const obstacle = currentRegion.entities.find(e => e.x === x && e.y === y && !e.cleared && e.type === 'obstacle');
    if (obstacle) return true;

    return false;
  }, [currentRegion]);

  // Handle interaction when Action is pressed
  const handleInteract = useCallback(() => {
    const currentX = Math.round(posRef.current.x);
    const currentY = Math.round(posRef.current.y);
    let targetX = currentX;
    let targetY = currentY;

    if (dirRef.current === 'down') targetY += 1;
    if (dirRef.current === 'up') targetY -= 1;
    if (dirRef.current === 'left') targetX -= 1;
    if (dirRef.current === 'right') targetX += 1;

    // Check entity at target tile or current tile
    const entity = currentRegion.entities.find(e => 
      ((e.x === targetX && e.y === targetY) || (e.x === currentX && e.y === currentY)) && !e.cleared
    );

    if (!entity) return;

    sound.playConfirm();

    if (entity.type === 'npc' && entity.dialog) {
      onTriggerDialogue(entity.name, entity.dialog);
      if (entity.isShop || entity.id.includes('botica') || entity.id.includes('boticario')) {
        setTimeout(() => {
          onOpenShop?.();
        }, 1000);
      }
      if (entity.rewardItem) {
        onOpenChest(entity.id, entity.rewardItem, entity.rewardGold);
      }
    } else if (entity.type === 'chest') {
      sound.playChestOpen();
      onOpenChest(entity.id, entity.rewardItem);
      if (entity.dialog) {
        onTriggerDialogue(entity.name, entity.dialog);
      }
    } else if (entity.type === 'wild_encounter') {
      sound.playEncounter();
      onTriggerDialogue('Espíritu Silvestre', [`¡Un ${entity.name} salvaje te desafía!`]);
      setTimeout(() => {
        onTriggerBattle(entity.encounterSpiritId || entity.sprite.replace('wild_', ''), false, { x: currentX, y: currentY }, entity.id);
      }, 700);
    } else if (entity.type === 'boss' && entity.bossSpiritId) {
      const bossAwakened = isStageBossAwakened(currentRegion);
      if (!bossAwakened) {
        sound.playCancel();
        onTriggerDialogue(
          'Monolito de Contención Ancestral',
          [
            'El altar del Guardián Regional está sellado por runas elementales durmientes.',
            'Completa todas las misiones del stage (hablar con los guías y superar los obstáculos/cofres) para despertar su presencia.'
          ]
        );
        return;
      }

      if (entity.dialog) {
        onTriggerDialogue(entity.name, entity.dialog);
      }
      setTimeout(() => {
        sound.playEncounter();
        onTriggerBattle(entity.bossSpiritId!, true, { x: currentX, y: currentY }, entity.id);
      }, 1000);
    } else if (entity.type === 'decorative' || entity.sprite.startsWith('deco_')) {
      sound.playAnimalSound(entity.sprite || entity.name);
      if (entity.dialog) {
        onTriggerDialogue(entity.name, entity.dialog);
      }
    } else if (entity.type === 'obstacle') {
      const hasElement = playerSpirit.primaryElement === entity.elementRequired || 
                         playerSpirit.secondaryElement === entity.elementRequired;
      if (hasElement) {
        sound.playConfirm();
        onClearObstacle(entity.id, entity.obstacleClearMessage || '¡Obstáculo superado!');
      } else {
        sound.playCancel();
        onTriggerDialogue(
          'Obstáculo Elemental',
          [entity.dialog?.[0] || `Se requiere un espíritu con poder elemental de ${entity.elementRequired?.toUpperCase()} para avanzar.`]
        );
      }
    } else if (entity.type === 'portal' && entity.destinationRegion) {
      if (entity.dialog) {
        onTriggerDialogue(entity.name, entity.dialog);
      }
      setTimeout(() => {
        onTravelPortal(entity.destinationRegion!, entity.destinationX, entity.destinationY);
      }, 800);
    }
  }, [currentRegion, playerSpirit, onTriggerDialogue, onTriggerBattle, onClearObstacle, onOpenChest, onTravelPortal]);

  // Keyboard continuous listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'Keyw'].includes(e.code)) {
        e.preventDefault();
        heldKeysRef.current.add('up');
      } else if (['ArrowDown', 'KeyS', 'Keys'].includes(e.code)) {
        e.preventDefault();
        heldKeysRef.current.add('down');
      } else if (['ArrowLeft', 'KeyA', 'Keya'].includes(e.code)) {
        e.preventDefault();
        heldKeysRef.current.add('left');
      } else if (['ArrowRight', 'KeyD', 'Keyd'].includes(e.code)) {
        e.preventDefault();
        heldKeysRef.current.add('right');
      } else if (['Space', 'Enter', 'KeyE', 'Keye'].includes(e.code)) {
        e.preventDefault();
        handleInteract();
      } else if (e.code === 'KeyB' || e.code === 'Keyb') {
        sound.playSelect();
        onOpenParty();
      } else if (e.code === 'KeyM' || e.code === 'Keym') {
        sound.playSelect();
        onOpenMap();
      } else if (e.code === 'KeyG' || e.code === 'Keyg') {
        sound.playSelect();
        setShowGuideModal(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'Keyw'].includes(e.code)) heldKeysRef.current.delete('up');
      if (['ArrowDown', 'KeyS', 'Keys'].includes(e.code)) heldKeysRef.current.delete('down');
      if (['ArrowLeft', 'KeyA', 'Keya'].includes(e.code)) heldKeysRef.current.delete('left');
      if (['ArrowRight', 'KeyD', 'Keyd'].includes(e.code)) heldKeysRef.current.delete('right');
    };

    const handleBlur = () => {
      heldKeysRef.current.clear();
      isMovingRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleInteract, onOpenParty, onOpenMap]);

  // Check nearby entity for prompt indicator
  useEffect(() => {
    const currentX = playerGridPos.x;
    const currentY = playerGridPos.y;
    let targetX = currentX;
    let targetY = currentY;
    if (playerDir === 'down') targetY += 1;
    if (playerDir === 'up') targetY -= 1;
    if (playerDir === 'left') targetX -= 1;
    if (playerDir === 'right') targetX += 1;

    const entity = currentRegion.entities.find(e => 
      ((e.x === targetX && e.y === targetY) || (e.x === currentX && e.y === currentY)) && !e.cleared
    );

    if (entity) {
      setNearbyEntity(entity);
      if (entity.type === 'npc') setInteractPrompt(`Hablar con ${entity.name}`);
      else if (entity.type === 'chest') setInteractPrompt('Abrir Cofre');
      else if (entity.type === 'obstacle') setInteractPrompt(`Inspeccionar: ${entity.name}`);
      else if (entity.type === 'boss') setInteractPrompt(`¡Desafiar a ${entity.name}!`);
      else if (entity.type === 'portal') setInteractPrompt(`Viajar: ${entity.name}`);
      else setInteractPrompt('Interactuar');
    } else {
      setNearbyEntity(null);
      setInteractPrompt(null);
    }
  }, [playerGridPos, playerDir, currentRegion]);

  // Main 60fps continuous simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const MOVE_SPEED = 4.2; // tiles per second (silky smooth walking speed)

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const pos = posRef.current;
      const target = targetPosRef.current;

      // 1. Move smoothly towards target tile
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0.001) {
        isMovingRef.current = true;
        const step = MOVE_SPEED * dt;
        if (dist <= step) {
          pos.x = target.x;
          pos.y = target.y;
          setPlayerGridPos({ x: target.x, y: target.y });
          footstepDistRef.current += dist;

          // 1. Direct contact with visible roaming wild spirits on the map
          const roamingSpirit = currentRegion.entities.find(e => {
            if (e.cleared) return false;
            if (e.type !== 'wild_encounter' && !e.sprite.startsWith('wild_')) return false;
            // Check tile distance
            const entX = e.x;
            const entY = e.y;
            return Math.abs(entX - target.x) <= 0.6 && Math.abs(entY - target.y) <= 0.6;
          });
          if (roamingSpirit) {
            heldKeysRef.current.clear();
            isMovingRef.current = false;
            sound.playEncounter();
            const spiritBaseId = roamingSpirit.encounterSpiritId || roamingSpirit.sprite.replace('wild_', '');
            onTriggerBattle(spiritBaseId, false, { x: target.x, y: target.y }, roamingSpirit.id);
            return;
          }

          // 2. Tall grass random encounter chance on tile arrival
          const arrivedTile = currentRegion.tiles[target.y]?.[target.x];
          if ((arrivedTile === 0 || arrivedTile === 6 || arrivedTile === 7) && currentRegion.wildEncounterTable.length > 0) {
            if (Math.random() < 0.05) {
              heldKeysRef.current.clear();
              isMovingRef.current = false;
              const table = currentRegion.wildEncounterTable;
              const chosen = table[Math.floor(Math.random() * table.length)];
              sound.playEncounter();
              onTriggerBattle(chosen.spiritId, false, { x: target.x, y: target.y });
              return;
            }
          }
        } else {
          pos.x += (dx / dist) * step;
          pos.y += (dy / dist) * step;
          footstepDistRef.current += step;
        }

        // Natural footstep sounds
        if (footstepDistRef.current >= 1.0) {
          sound.playStep();
          footstepDistRef.current = 0;
        }

        // Smooth leg walk progress
        walkProgressRef.current += dt * 5.8;
      } else {
        // At rest: check if directional key is held to proceed immediately
        pos.x = target.x;
        pos.y = target.y;
        let nextDx = 0;
        let nextDy = 0;
        let newDir: 'down' | 'up' | 'left' | 'right' | null = null;

        if (heldKeysRef.current.has('up')) { nextDy = -1; newDir = 'up'; }
        else if (heldKeysRef.current.has('down')) { nextDy = 1; newDir = 'down'; }
        else if (heldKeysRef.current.has('left')) { nextDx = -1; newDir = 'left'; }
        else if (heldKeysRef.current.has('right')) { nextDx = 1; newDir = 'right'; }

        if (newDir) {
          dirRef.current = newDir;
          setPlayerDir(newDir);

          const nextX = target.x + nextDx;
          const nextY = target.y + nextDy;

          if (!isTileBlocked(nextX, nextY)) {
            targetPosRef.current = { x: nextX, y: nextY };
            isMovingRef.current = true;
          } else {
            isMovingRef.current = false;
          }
        } else {
          isMovingRef.current = false;
          walkProgressRef.current += dt * 1.5; // Gentle breathing idle animation
        }
      }

      // 2. Render Scene to Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const width = canvas.width;
          const height = canvas.height;

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, width, height);

          // Center camera smoothly on floating player position
          const cameraX = Math.round(pos.x * TILE_SIZE - width / 2 + TILE_SIZE / 2);
          const cameraY = Math.round(pos.y * TILE_SIZE - height / 2 + TILE_SIZE / 2);

          ctx.save();
          ctx.translate(-cameraX, -cameraY);

          // Draw Tiles
          for (let y = 0; y < currentRegion.height; y++) {
            for (let x = 0; x < currentRegion.width; x++) {
              const tile = currentRegion.tiles[y]?.[x] ?? 0;
              const px = x * TILE_SIZE;
              const py = y * TILE_SIZE;

              if (tile === 0) {
                // Grass
                ctx.fillStyle = currentRegion.id === 'villarrica' ? '#3f3f46' : '#15803d';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = currentRegion.id === 'villarrica' ? '#52525b' : '#16a34a';
                ctx.fillRect(px + 4, py + 4, 3, 4);
                ctx.fillRect(px + 18, py + 16, 3, 4);
              } else if (tile === 1) {
                // Dirt path
                ctx.fillStyle = '#a16207';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#b45309';
                ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
              } else if (tile === 2) {
                // Water waves
                ctx.fillStyle = '#0284c7';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#38bdf8';
                const wave = Math.sin(currentTime * 0.004 + x + y) * 3;
                ctx.fillRect(px + 4, py + 10 + wave, 12, 2.5);
                ctx.fillRect(px + 16, py + 20 - wave, 10, 2.5);
              } else if (tile === 3) {
                // Mountain Wall
                ctx.fillStyle = currentRegion.id === 'villarrica' ? '#1c1917' : '#334155';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = currentRegion.id === 'villarrica' ? '#292524' : '#475569';
                ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
              } else if (tile === 4) {
                // Dense Native Tree
                ctx.fillStyle = '#064e3b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#047857';
                ctx.beginPath();
                ctx.moveTo(px + TILE_SIZE / 2, py + 2);
                ctx.lineTo(px + TILE_SIZE - 3, py + TILE_SIZE - 4);
                ctx.lineTo(px + 3, py + TILE_SIZE - 4);
                ctx.closePath();
                ctx.fill();
              } else if (tile === 5) {
                // Lava Magma
                ctx.fillStyle = '#991b1b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#f97316';
                const lava = Math.sin(currentTime * 0.005 + x) * 2;
                ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
                ctx.fillStyle = '#fde047';
                ctx.fillRect(px + 10 + lava, py + 10, 8, 8);
              } else if (tile === 6) {
                // Snow & Glacier
                ctx.fillStyle = '#e0f2fe';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#bae6fd';
                ctx.fillRect(px + 6, py + 8, 14, 4);
              } else if (tile === 7) {
                // Wild Flowers & Matico
                ctx.fillStyle = currentRegion.id === 'villarrica' ? '#3f3f46' : '#15803d';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = (x + y) % 2 === 0 ? '#ef4444' : '#facc15';
                ctx.beginPath();
                ctx.arc(px + 10, py + 10, 3, 0, Math.PI * 2);
                ctx.arc(px + 22, py + 20, 3, 0, Math.PI * 2);
                ctx.fill();
              }

              ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
              ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
            }
          }

          // Draw Entities with organic roaming displacement for wild creatures
          const stageBossAwakened = isStageBossAwakened(currentRegion);

          currentRegion.entities.forEach(ent => {
            let renderX = ent.x * TILE_SIZE;
            let renderY = ent.y * TILE_SIZE;

            // Roaming monster active displacement (patrol within a 1.2 tile radius)
            if (!ent.cleared && (ent.type === 'wild_encounter' || ent.sprite.startsWith('wild_'))) {
              const hash = (ent.id.charCodeAt(ent.id.length - 1) || 1);
              const patrolSpeed = 0.0015 + (hash % 3) * 0.0005;
              const patrolRadius = TILE_SIZE * 0.75;
              // Smooth circular/figure-8 patrol path
              const patrolOffsetX = Math.cos(currentTime * patrolSpeed + hash) * patrolRadius;
              const patrolOffsetY = Math.sin(currentTime * patrolSpeed * 1.3 + hash) * (patrolRadius * 0.7);
              renderX += patrolOffsetX;
              renderY += patrolOffsetY;
            }

            drawEntitySprite(
              ctx, 
              ent.type, 
              ent.sprite, 
              renderX, 
              renderY, 
              TILE_SIZE, 
              ent.cleared || false, 
              Math.floor(currentTime * 0.005),
              stageBossAwakened
            );

            // Explicit Boss Danger Beacon & Crest
            if (ent.type === 'boss' && !ent.cleared) {
              const bPulse = Math.sin(currentTime * 0.007) * 4;
              
              if (stageBossAwakened) {
                // Ground warning ring
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ent.x * TILE_SIZE + TILE_SIZE / 2, ent.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE * 0.85 + bPulse, 0, Math.PI * 2);
                ctx.stroke();

                // Boss Crest Badge floating above
                const badgeW = 96;
                const badgeH = 18;
                const bx = ent.x * TILE_SIZE + TILE_SIZE / 2 - badgeW / 2;
                const by = ent.y * TILE_SIZE - 20 + bPulse;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
                ctx.fillRect(bx, by, badgeW, badgeH);
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(bx, by, badgeW, badgeH);

                ctx.fillStyle = '#fca5a5';
                ctx.font = 'bold 8px monospace';
                ctx.fillText('⚔️ JEFE DESPIERTO', bx + 6, by + 12);
              } else {
                // Dormant Altar seal badge
                const badgeW = 92;
                const badgeH = 16;
                const bx = ent.x * TILE_SIZE + TILE_SIZE / 2 - badgeW / 2;
                const by = ent.y * TILE_SIZE - 18 + bPulse * 0.5;

                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.fillRect(bx, by, badgeW, badgeH);
                ctx.strokeStyle = '#a855f7';
                ctx.lineWidth = 1;
                ctx.strokeRect(bx, by, badgeW, badgeH);

                ctx.fillStyle = '#d8b4fe';
                ctx.font = 'bold 8px monospace';
                ctx.fillText('🔒 SELLO ACTIVO', bx + 6, by + 11);
              }
            }

            // Objective Marker Beacon above current quest target
            if (
              currentQuest.targetCoords && 
              ent.x === currentQuest.targetCoords.x && 
              ent.y === currentQuest.targetCoords.y && 
              !ent.cleared
            ) {
              const pulse = Math.sin(currentTime * 0.008) * 4;
              ctx.fillStyle = '#facc15';
              ctx.beginPath();
              ctx.moveTo(ent.x * TILE_SIZE + TILE_SIZE / 2, ent.y * TILE_SIZE - 4 + pulse);
              ctx.lineTo(ent.x * TILE_SIZE + TILE_SIZE / 2 - 6, ent.y * TILE_SIZE - 14 + pulse);
              ctx.lineTo(ent.x * TILE_SIZE + TILE_SIZE / 2 + 6, ent.y * TILE_SIZE - 14 + pulse);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
              ctx.beginPath();
              ctx.arc(ent.x * TILE_SIZE + TILE_SIZE / 2, ent.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 1.5 + pulse, 0, Math.PI * 2);
              ctx.fill();
            }
          });

          // Draw Barbara with fluid movement & bobbing
          drawBarbaraSprite(
            ctx,
            pos.x * TILE_SIZE,
            pos.y * TILE_SIZE,
            TILE_SIZE,
            dirRef.current,
            walkProgressRef.current,
            isMovingRef.current
          );

          // Interaction exclamation mark if near entity
          if (nearbyEntity) {
            ctx.fillStyle = '#facc15';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('!', pos.x * TILE_SIZE + TILE_SIZE / 2 - 3, pos.y * TILE_SIZE - 6);
          }

          ctx.restore();

          // Weather overlays
          if (currentRegion.weather === 'lluvia_suave') {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
            ctx.lineWidth = 1.2;
            for (let i = 0; i < 40; i++) {
              const rx = (i * 47 + currentTime * 0.4) % width;
              const ry = (i * 31 + currentTime * 0.6) % height;
              ctx.beginPath();
              ctx.moveTo(rx, ry);
              ctx.lineTo(rx - 5, ry + 12);
              ctx.stroke();
            }
          } else if (currentRegion.weather === 'ceniza_volcanica') {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
            for (let i = 0; i < 30; i++) {
              const ex = (i * 53 + Math.sin(currentTime * 0.002 + i) * 25) % width;
              const ey = (height - (i * 37 + currentTime * 0.09) % height);
              ctx.fillRect(ex, ey, 2, 2);
            }
          } else if (currentRegion.weather === 'ventisca_austral') {
            ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
            for (let i = 0; i < 45; i++) {
              const sx = (i * 43 + currentTime * 0.25) % width;
              const sy = (i * 29 + currentTime * 0.18) % height;
              ctx.beginPath();
              ctx.arc(sx, sy, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentRegion, TILE_SIZE, isTileBlocked, onTriggerBattle, currentQuest]);

  // Virtual Gamepad Direction press handlers
  const handleDirectionPress = (dir: 'up' | 'down' | 'left' | 'right') => {
    heldKeysRef.current.add(dir);
  };
  const handleDirectionRelease = (dir: 'up' | 'down' | 'left' | 'right') => {
    heldKeysRef.current.delete(dir);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* 60fps Canvas Viewport with responsive compact tiles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={960} 
          height={600} 
          className="w-full h-full object-cover image-render-pixel"
        />
      </div>

      {/* Top Floating HUD: Region & Menu Buttons */}
      <header className="relative z-20 w-full p-3 flex flex-wrap justify-between items-start max-w-6xl mx-auto pointer-events-none gap-2">
        {/* Region & Gold Cluster */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl shadow-lg pointer-events-auto flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-pixel text-[11px] text-white flex items-center gap-1.5">
              <span>{currentRegion.name}</span>
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="text-amber-400 font-bold">💰 {barbara.gold}</span>
              <span>&middot;</span>
              <span>{playerSpirit.name} (Nv. {playerSpirit.level})</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Guide button */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* GUÍA DE AVENTURA BUTTON */}
          <button
            onClick={() => {
              sound.playSelect();
              setShowGuideModal(true);
            }}
            className="p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border border-amber-400/80 rounded-xl text-white transition-all flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer shadow-lg shadow-amber-950"
            title="Guía de Aventura & Misión [G]"
          >
            <BookOpen className="w-4 h-4 text-amber-200" />
            <span className="hidden sm:inline">Guía & Misiones</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onOpenParty();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
            title="Equipo & Trabajos [B]"
          >
            <Swords className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Equipo</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onOpenEvolution();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/50 rounded-xl text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
            title="Santuario de Evolución"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Evolución</span>
          </button>

          {onOpenBestiary && (
            <button
              onClick={() => {
                sound.playSelect();
                onOpenBestiary();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 rounded-xl text-cyan-300 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
              title="Bestiario / Pokédex de la Naturaleza"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Bestiario</span>
            </button>
          )}

          {onOpenShop && (
            <button
              onClick={() => {
                sound.playSelect();
                onOpenShop();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-amber-400/60 rounded-xl text-amber-300 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
              title="Botica & Provisiones (Pociones, Maná, Revivir)"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Botica</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playSelect();
              onOpenInventory();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
            title="Mochila"
          >
            <Backpack className="w-4 h-4 text-sky-400" />
            <span className="hidden md:inline">Mochila</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              onOpenMap();
            }}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
            title="Mapa de Chile [M]"
          >
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Mapa</span>
          </button>

          {onSaveGame && (
            <button
              onClick={() => {
                sound.playConfirm();
                onSaveGame();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/50 rounded-xl text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
              title="Guardar Partida"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">Guardar</span>
            </button>
          )}

          {onResetGame && (
            <button
              onClick={() => {
                sound.playCancel();
                onResetGame();
              }}
              className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-rose-500/50 rounded-xl text-rose-300 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-md"
              title="Reiniciar Partida"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span className="hidden lg:inline">Reiniciar</span>
            </button>
          )}

          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 transition-colors cursor-pointer shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Floating Active Quest Indicator - Positioned at Right Side per user request */}
      {showQuestBanner ? (
        <div className="fixed top-16 right-3 sm:right-6 z-30 max-w-xs sm:max-w-sm w-full pointer-events-none">
          <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/80 p-3.5 rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-2 animate-in fade-in slide-in-from-right-3 duration-300">
            {/* Header row with step badge & close button */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/50 flex-shrink-0 flex items-center justify-center text-amber-400">
                  <Target className="w-3 h-3 animate-pulse" />
                </div>
                <span className="px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded text-[9px] font-silkscreen text-amber-300 font-bold uppercase tracking-wider">
                  PASO {currentQuest.stepNumber}/{currentQuest.totalSteps}
                </span>
                <span className="font-silkscreen text-[10px] text-white truncate">{currentQuest.title}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[9px] font-mono text-amber-300 hover:text-white transition-colors cursor-pointer"
                  title="Abrir Guía Completa"
                >
                  Guía
                </button>
                <button
                  onClick={() => {
                    sound.playCancel();
                    setShowQuestBanner(false);
                  }}
                  className="p-1 bg-slate-800/80 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Minimizar panel de misión al costado derecho"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instruction body */}
            <p className="text-slate-200 text-xs font-ui leading-relaxed font-semibold">
              {currentQuest.instruction}
            </p>
            <p className="text-slate-400 text-[10px] font-mono mt-0.5 flex items-start gap-1">
              <span>💡</span>
              <span>{currentQuest.hint}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="fixed top-16 right-3 sm:right-6 z-30 pointer-events-auto">
          <button
            onClick={() => {
              sound.playSelect();
              setShowQuestBanner(true);
            }}
            className="px-3 py-1.5 bg-slate-900/95 hover:bg-slate-800 border border-amber-500/70 rounded-full font-silkscreen text-[10px] text-amber-300 shadow-xl flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            title="Abrir Misión Actual"
          >
            <Target className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Misión {currentQuest.stepNumber}/{currentQuest.totalSteps}</span>
            <Maximize2 className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      )}

      {/* Center Interactive Prompt when near entity */}
      {interactPrompt && (
        <div className="relative z-20 mx-auto pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-150 my-2">
          <button
            onClick={handleInteract}
            className="px-4 py-2 bg-slate-950/95 hover:bg-slate-900 border-2 border-amber-400 rounded-full font-pixel text-xs text-amber-300 shadow-xl shadow-black/80 flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{interactPrompt}</span>
            <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 font-mono">[Espacio / Acción]</span>
          </button>
        </div>
      )}

      {/* Bottom Virtual Gamepad & Status Cluster */}
      <footer className="relative z-20 w-full p-4 flex justify-between items-end max-w-5xl mx-auto pointer-events-none">
        {/* Virtual D-Pad for Mobile & Mouse with continuous press */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur p-2 rounded-2xl border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-3 gap-1 w-32 h-32">
            <div />
            <button
              onPointerDown={() => handleDirectionPress('up')}
              onPointerUp={() => handleDirectionRelease('up')}
              onPointerLeave={() => handleDirectionRelease('up')}
              className="bg-slate-800 active:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-200 active:text-white cursor-pointer select-none"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
            <div />

            <button
              onPointerDown={() => handleDirectionPress('left')}
              onPointerUp={() => handleDirectionRelease('left')}
              onPointerLeave={() => handleDirectionRelease('left')}
              className="bg-slate-800 active:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-200 active:text-white cursor-pointer select-none"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="bg-slate-900/50 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
            </div>
            <button
              onPointerDown={() => handleDirectionPress('right')}
              onPointerUp={() => handleDirectionRelease('right')}
              onPointerLeave={() => handleDirectionRelease('right')}
              className="bg-slate-800 active:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-200 active:text-white cursor-pointer select-none"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div />
            <button
              onPointerDown={() => handleDirectionPress('down')}
              onPointerUp={() => handleDirectionRelease('down')}
              onPointerLeave={() => handleDirectionRelease('down')}
              className="bg-slate-800 active:bg-emerald-600 rounded-lg flex items-center justify-center text-slate-200 active:text-white cursor-pointer select-none"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div />
          </div>
        </div>

        {/* Action Button & Active Spirit Cluster */}
        <div className="pointer-events-auto flex flex-col items-end gap-3">
          {/* Active Spirit Health Bar */}
          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-2.5 rounded-xl shadow-lg flex items-center gap-3">
            <span className="text-2xl">{playerSpirit.evolutionLine[playerSpirit.currentStage - 1]?.icon || '🌱'}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-white">{playerSpirit.name}</span>
                <span className="font-mono text-[10px] text-emerald-400 font-bold">Nv. {playerSpirit.level}</span>
              </div>
              <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(playerSpirit.currentHp / playerSpirit.maxHp) * 100}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Big Action Button (Interact / Confirm) */}
          <button
            onClick={handleInteract}
            className="w-20 h-20 bg-gradient-to-tr from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 text-slate-950 rounded-full font-pixel text-xs font-black shadow-xl shadow-amber-950/60 border-4 border-amber-300 flex flex-col items-center justify-center cursor-pointer transform active:scale-90 transition-transform"
          >
            <span>ACCIÓN</span>
            <span className="text-[9px] font-mono font-bold">[A]</span>
          </button>
        </div>
      </footer>

      {/* ADVENTURE GUIDE MODAL */}
      {showGuideModal && (
        <AdventureGuideModal onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
};
