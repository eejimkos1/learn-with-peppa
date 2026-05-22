import { UserProfile, GameProgress, GameSettings } from '../types';
import { scheduleSyncToGist } from './gistSync';

const USERS_KEY = 'peppa-users';
const ACTIVE_USER_KEY = 'peppa-active-user';

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

function getAllUsers(): Record<string, UserProfile> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* corrupted */ }
  return {};
}

function saveAllUsers(users: Record<string, UserProfile>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function registerUser(name: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.length > 20) {
    return { success: false, error: 'Το όνομα πρέπει να είναι 1-20 χαρακτήρες.' };
  }

  if (password.length < 4 || password.length > 8) {
    return { success: false, error: 'Ο κωδικός πρέπει να είναι 4-8 χαρακτήρες.' };
  }

  if (users[trimmedName]) {
    return { success: false, error: 'Αυτό το όνομα υπάρχει ήδη!' };
  }

  const userCount = Object.keys(users).length;
  if (userCount >= 10) {
    return { success: false, error: 'Μέγιστος αριθμός παικτών (10)!' };
  }

  const passwordHash = await hashPassword(password);
  users[trimmedName] = {
    passwordHash,
    progress: { ...DEFAULT_PROGRESS },
    settings: { ...DEFAULT_SETTINGS },
  };

  saveAllUsers(users);
  scheduleSyncToGist();
  localStorage.setItem(ACTIVE_USER_KEY, trimmedName);
  return { success: true };
}

export async function loginUser(name: string, password: string): Promise<{ success: boolean; error?: string }> {
  const users = getAllUsers();
  const trimmedName = name.trim();
  const user = users[trimmedName];

  if (!user) {
    return { success: false, error: 'Δεν βρέθηκε αυτό το όνομα!' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    return { success: false, error: 'Λάθος κωδικός!' };
  }

  localStorage.setItem(ACTIVE_USER_KEY, trimmedName);
  return { success: true };
}

export function logoutUser(): void {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

export function getActiveUser(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY);
}

export function getActiveUserProfile(): UserProfile | null {
  const name = getActiveUser();
  if (!name) return null;
  const users = getAllUsers();
  return users[name] || null;
}

export function saveUserProgress(progress: GameProgress): void {
  const name = getActiveUser();
  if (!name) return;
  const users = getAllUsers();
  if (users[name]) {
    users[name].progress = progress;
    saveAllUsers(users);
    scheduleSyncToGist();
  }
}

export function saveUserSettings(settings: GameSettings): void {
  const name = getActiveUser();
  if (!name) return;
  const users = getAllUsers();
  if (users[name]) {
    users[name].settings = settings;
    saveAllUsers(users);
    scheduleSyncToGist();
  }
}

export interface LeaderboardEntry {
  username: string;
  totalStars: number;
  unlockedWorldsCount: number;
}

export function getLeaderboardData(): LeaderboardEntry[] {
  const users = getAllUsers();
  return Object.entries(users)
    .map(([username, profile]) => ({
      username,
      totalStars: profile.progress.totalStars,
      unlockedWorldsCount: profile.progress.unlockedWorlds.length,
    }))
    .sort((a, b) => b.totalStars - a.totalStars);
}
