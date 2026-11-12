/**
 * Storage Service for Bárbara: Crónicas Elementales del Sur
 * Supports 3 distinct save slots (Slot 1, Slot 2, Slot 3) with timestamps,
 * party summary, region location, and backwards compatibility.
 */

import { BarbaraHero, SpiritCreature, InventoryItem, RegionId } from '../types/game';

export interface SavedGameData {
  version: number;
  slotId: number;
  savedAt: string;
  currentRegionId: RegionId;
  unlockedRegions: RegionId[];
  barbara: BarbaraHero;
  partySpirits: SpiritCreature[];
  inventory: Record<string, InventoryItem>;
  clearedEntityIds: string[];
  playerSpawnPos: { x: number; y: number };
}

export interface SlotSummary {
  slotId: number;
  savedAt: string;
  regionId: RegionId;
  barbaraLevel: number;
  spiritCount: number;
  leaderSpiritName: string;
  leaderSpiritIcon: string;
  gold: number;
}

const SLOT_KEY_PREFIX = 'barbara_cronicas_slot_';
const LEGACY_KEY = 'barbara_cronicas_elementales_save_v1';

export const storageService = {
  getSlotKey(slotId: number): string {
    return `${SLOT_KEY_PREFIX}${slotId}`;
  },

  saveGame(slotId: number, data: Omit<SavedGameData, 'version' | 'savedAt' | 'slotId'>): boolean {
    try {
      const payload: SavedGameData = {
        ...data,
        slotId,
        version: 2,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(this.getSlotKey(slotId), JSON.stringify(payload));
      return true;
    } catch (e) {
      console.error(`Error saving game in slot ${slotId}:`, e);
      return false;
    }
  },

  loadGame(slotId: number): SavedGameData | null {
    try {
      const raw = localStorage.getItem(this.getSlotKey(slotId));
      if (raw) {
        return JSON.parse(raw) as SavedGameData;
      }
      // If slot 1 is requested and legacy key exists, migrate legacy
      if (slotId === 1) {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy) as SavedGameData;
          parsed.slotId = 1;
          return parsed;
        }
      }
      return null;
    } catch (e) {
      console.error(`Error loading game from slot ${slotId}:`, e);
      return null;
    }
  },

  deleteSlot(slotId: number): boolean {
    try {
      localStorage.removeItem(this.getSlotKey(slotId));
      if (slotId === 1) {
        localStorage.removeItem(LEGACY_KEY);
      }
      return true;
    } catch (e) {
      console.error(`Error deleting slot ${slotId}:`, e);
      return false;
    }
  },

  getSlotSummary(slotId: number): SlotSummary | null {
    const data = this.loadGame(slotId);
    if (!data) return null;
    const leader = data.partySpirits?.[0];
    const leaderIcon = leader?.evolutionLine?.[leader.currentStage - 1]?.icon || '🌱';
    return {
      slotId,
      savedAt: data.savedAt,
      regionId: data.currentRegionId,
      barbaraLevel: data.barbara?.level || 1,
      spiritCount: data.partySpirits?.length || 0,
      leaderSpiritName: leader?.name || 'Compañero',
      leaderSpiritIcon: leaderIcon,
      gold: data.barbara?.gold || 0,
    };
  },

  getAllSlots(): (SlotSummary | null)[] {
    return [1, 2, 3].map(id => this.getSlotSummary(id));
  },

  hasSavedGame(): boolean {
    return [1, 2, 3].some(id => localStorage.getItem(this.getSlotKey(id)) !== null) ||
           localStorage.getItem(LEGACY_KEY) !== null;
  },

  resetAll(): boolean {
    try {
      [1, 2, 3].forEach(id => localStorage.removeItem(this.getSlotKey(id)));
      localStorage.removeItem(LEGACY_KEY);
      return true;
    } catch (e) {
      console.error('Error resetting all games:', e);
      return false;
    }
  }
};
