import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameProgress, GameSettings, Screen, WorldId, LevelResult, ItemSlot } from '../types';
import { loadProgress, saveProgress, loadSettings, saveSettings, getUnlockedWorlds } from '../utils/storage';
import { REWARDS } from '../data/rewards';

interface GameState {
  screen: Screen;
  progress: GameProgress;
  settings: GameSettings;
  currentWorld: WorldId | null;
  currentLevel: number;
}

type GameAction =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SELECT_WORLD'; worldId: WorldId }
  | { type: 'SELECT_LEVEL'; level: number }
  | { type: 'COMPLETE_LEVEL'; result: LevelResult }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_USER' }
  | { type: 'EQUIP_ITEM'; slot: ItemSlot; rewardId: string }
  | { type: 'UNEQUIP_ITEM'; slot: ItemSlot };

function checkNewRewards(totalStars: number, currentRewards: string[]): string[] {
  const newRewards = [...currentRewards];
  for (const reward of REWARDS) {
    if (totalStars >= reward.starsRequired && !newRewards.includes(reward.id)) {
      newRewards.push(reward.id);
    }
  }
  return newRewards;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };

    case 'LOAD_USER':
      return { ...state, progress: loadProgress(), settings: loadSettings() };

    case 'SELECT_WORLD':
      return { ...state, currentWorld: action.worldId, screen: 'daySchedule' };

    case 'SELECT_LEVEL':
      return { ...state, currentLevel: action.level };

    case 'COMPLETE_LEVEL': {
      const { result } = action;
      const key = `${result.worldId}-${result.levelIndex}`;
      const existing = state.progress.levelResults[key];
      const prevStars = existing ? existing.stars : 0;
      const starGain = Math.max(0, result.stars - prevStars);
      const newTotalStars = state.progress.totalStars + starGain;
      const newResults = { ...state.progress.levelResults, [key]: result };
      const newRewards = checkNewRewards(newTotalStars, state.progress.unlockedRewards);
      const newUnlockedWorlds = getUnlockedWorlds(newTotalStars);

      return {
        ...state,
        screen: 'results',
        progress: {
          ...state.progress,
          totalStars: newTotalStars,
          levelResults: newResults,
          unlockedRewards: newRewards,
          unlockedWorlds: newUnlockedWorlds,
        },
      };
    }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };

    case 'RESET_PROGRESS':
      return {
        ...state,
        progress: {
          totalStars: 0,
          unlockedWorlds: ['house', 'park'],
          levelResults: {},
          unlockedRewards: [],
          currentWorld: null,
          equippedItems: { head: null, body: null, feet: null, back: null, hand: null },
        },
      };

    case 'EQUIP_ITEM':
      return {
        ...state,
        progress: {
          ...state.progress,
          equippedItems: { ...state.progress.equippedItems, [action.slot]: action.rewardId },
        },
      };

    case 'UNEQUIP_ITEM':
      return {
        ...state,
        progress: {
          ...state.progress,
          equippedItems: { ...state.progress.equippedItems, [action.slot]: null },
        },
      };

    default:
      return state;
  }
}

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<GameAction> } | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    screen: 'splash',
    progress: loadProgress(),
    settings: loadSettings(),
    currentWorld: null,
    currentLevel: 0,
  });

  useEffect(() => { saveProgress(state.progress); }, [state.progress]);
  useEffect(() => { saveSettings(state.settings); }, [state.settings]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
