import { GameProgress, GameSettings, WorldId } from '../types';
import { getActiveUserProfile, saveUserProgress, saveUserSettings } from './auth';
import { WORLDS } from '../data/worlds';

const DEFAULT_PROGRESS: GameProgress = {
  totalStars: 0,
  unlockedWorlds: ['house', 'park'],
  levelResults: {},
  unlockedRewards: [],
  currentWorld: null,
  equippedItems: { head: null, body: null, feet: null, back: null, hand: null },
};

const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  volume: 0.8,
};

export function loadProgress(): GameProgress {
  const profile = getActiveUserProfile();
  if (profile) {
    return { ...DEFAULT_PROGRESS, ...profile.progress };
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(progress: GameProgress): void {
  saveUserProgress(progress);
}

export function loadSettings(): GameSettings {
  const profile = getActiveUserProfile();
  if (profile) {
    return { ...DEFAULT_SETTINGS, ...profile.settings };
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: GameSettings): void {
  saveUserSettings(settings);
}

export function getUnlockedWorlds(totalStars: number): WorldId[] {
  return WORLDS.filter((world) => world.starsRequired <= totalStars).map((world) => world.id);
}
