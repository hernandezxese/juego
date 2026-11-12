/**
 * Core Game Types for Bárbara: Crónicas Elementales del Sur
 * Inspired by Pokémon FireRed & Final Fantasy III
 */

export type ElementType = 'fuego' | 'agua' | 'planta' | 'viento' | 'tierra' | 'hielo' | 'sagrado' | 'normal';

export type RegionId = 'santiago' | 'pucon' | 'villarrica' | 'hornopiren';

export type JobClass = 'naturalista' | 'chaman' | 'guardaparque' | 'mistica';

export type GameState = 
  | 'title' 
  | 'intro' 
  | 'exploration' 
  | 'battle' 
  | 'evolution' 
  | 'party' 
  | 'inventory' 
  | 'shop'
  | 'bestiary'
  | 'map' 
  | 'victory' 
  | 'gameover';

export interface ElementalSkill {
  id: string;
  name: string;
  element: ElementType;
  power: number;
  mpCost: number;
  accuracy: number;
  category: 'physical' | 'elemental' | 'support' | 'heal';
  target: 'single_enemy' | 'all_enemies' | 'single_ally' | 'all_allies' | 'self';
  description: string;
  effectType?: 'burn' | 'freeze' | 'poison' | 'paralyze' | 'attack_buff' | 'defense_buff' | 'heal' | 'speed_buff';
  effectChance?: number;
  animationColor: string;
}

export interface EvolutionStage {
  stage: number; // 1, 2, 3
  name: string;
  title: string;
  description: string;
  spriteKey: string;
  icon: string;
  baseHp: number;
  baseMp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpAttack: number;
  baseSpDefense: number;
  baseSpeed: number;
  requiredLevel: number;
  requiredItem?: string;
  signatureSkill: ElementalSkill;
}

export interface SpiritCreature {
  uid: string;
  baseId: string;
  nickname?: string;
  name: string;
  primaryElement: ElementType;
  secondaryElement?: ElementType;
  level: number;
  exp: number;
  maxExp: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  currentStage: number; // 1, 2, 3
  evolutionLine: EvolutionStage[];
  skills: ElementalSkill[];
  statusCondition?: 'burn' | 'freeze' | 'paralyze' | 'faint' | null;
  statusDuration?: number;
  lore: string;
  rarity: 'común' | 'raro' | 'místico' | 'legendario';
}

export interface BarbaraHero {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  job: JobClass;
  jobMastery: Record<JobClass, number>; // level 1..5 for each job
  limitGauge: number; // 0..100% (Invocación de la Naturaleza)
  resonanceOrbs: number; // For catching spirits
  gold: number;
  activeSpiritUids: string[]; // Up to 4 spirits in battle
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'curativo' | 'esencia' | 'captura' | 'clave';
  description: string;
  count: number;
  icon: string;
  effectType: 'heal_hp' | 'heal_mp' | 'revive' | 'evolution' | 'resonance' | 'cure_status';
  effectValue: number;
  price?: number;
  targetRequiredItemName?: string;
}

export interface OverworldEntity {
  id: string;
  x: number;
  y: number;
  type: 'npc' | 'chest' | 'wild_encounter' | 'boss' | 'obstacle' | 'portal' | 'shrine' | 'decorative';
  name: string;
  sprite: string;
  direction?: 'down' | 'up' | 'left' | 'right';
  dialog?: string[];
  rewardItem?: { id: string; count: number };
  rewardGold?: number;
  elementRequired?: ElementType;
  obstacleClearMessage?: string;
  bossSpiritId?: string;
  encounterSpiritId?: string;
  requiresMissionsCleared?: boolean;
  cleared?: boolean;
  destinationRegion?: RegionId;
  destinationX?: number;
  destinationY?: number;
  isShop?: boolean;
}

export interface MapRegion {
  id: RegionId;
  name: string;
  subtitle: string;
  lore: string;
  width: number;
  height: number;
  tiles: number[][]; // 0: grass, 1: path, 2: water, 3: mountain/rock, 4: forest/tree, 5: lava, 6: snow/ice, 7: flowers
  ambientColor: string;
  themeColor: string;
  weather: 'soleado' | 'lluvia_suave' | 'ceniza_volcanica' | 'ventisca_austral';
  bgmId: 'santiago' | 'pucon' | 'villarrica' | 'hornopiren';
  entities: OverworldEntity[];
  wildEncounterTable: { spiritId: string; minLevel: number; maxLevel: number; weight: number }[];
  isUnlocked: boolean;
}

export interface BattleTurnAction {
  actorId: string;
  isPlayer: boolean;
  isHero?: boolean;
  actionType: 'skill' | 'item' | 'capture' | 'switch' | 'limit';
  skill?: ElementalSkill;
  targetId: string;
  itemId?: string;
}

export interface BattleLogEntry {
  id: string;
  text: string;
  type: 'damage' | 'heal' | 'status' | 'combo' | 'capture' | 'info' | 'critical';
}
