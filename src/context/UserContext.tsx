import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  getActiveUser,
  getActiveUserProfile,
  registerUser,
  loginUser,
  logoutUser,
} from '../utils/auth';
import { initSync } from '../utils/gistSync';
import { GameProgress, GameSettings } from '../types';

interface UserContextType {
  currentUser: string | null;
  isAuthenticated: boolean;
  syncReady: boolean;
  login: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getUserProgress: () => GameProgress;
  getUserSettings: () => GameSettings;
}

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

const UserCtx = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string | null>(getActiveUser());
  const [syncReady, setSyncReady] = useState(false);

  useEffect(() => {
    initSync().then(() => {
      setCurrentUser(getActiveUser());
      setSyncReady(true);
    });
  }, []);

  const login = useCallback(async (name: string, password: string) => {
    const result = await loginUser(name, password);
    if (result.success) {
      setCurrentUser(name.trim());
    }
    return result;
  }, []);

  const register = useCallback(async (name: string, password: string) => {
    const result = await registerUser(name, password);
    if (result.success) {
      setCurrentUser(name.trim());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
  }, []);

  const getUserProgress = useCallback((): GameProgress => {
    const profile = getActiveUserProfile();
    return profile?.progress || { ...DEFAULT_PROGRESS };
  }, []);

  const getUserSettings = useCallback((): GameSettings => {
    const profile = getActiveUserProfile();
    return profile?.settings || { ...DEFAULT_SETTINGS };
  }, []);

  return (
    <UserCtx.Provider value={{
      currentUser,
      isAuthenticated: currentUser !== null,
      syncReady,
      login,
      register,
      logout,
      getUserProgress,
      getUserSettings,
    }}>
      {children}
    </UserCtx.Provider>
  );
}

export function useUser() {
  const context = useContext(UserCtx);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
