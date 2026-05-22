export type WorldId = 'house' | 'park' | 'school' | 'supermarket' | 'beach' | 'zoo' | 'party';

export type Screen =
  | 'splash'
  | 'auth'
  | 'home'
  | 'worldMap'
  | 'daySchedule'
  | 'showAndTell'
  | 'pictureExplorer'
  | 'singAlong'
  | 'quiz'
  | 'scenePicker'
  | 'hangman'
  | 'results'
  | 'trophy'
  | 'settings'
  | 'leaderboard'
  | 'dressUp';

export type ThemeStyle = 'classic' | 'sparkle' | 'adventure';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export interface VocabularyWord {
  english: string;
  greek: string;
  picture: string; // emoji or SVG path
  audio?: string; // optional pre-recorded audio path
}

export interface WorldConfig {
  id: WorldId;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  starsRequired: number;
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  floatingElements: string[];
  vocabulary: VocabularyWord[];
  songId: string;
  showGreek: 'full' | 'reduced' | 'none';
}

export interface SongConfig {
  id: string;
  title: string;
  titleGreek: string;
  lyrics: string[]; // lines
  blanks: { lineIndex: number; wordIndex: number; answer: string; options: string[] }[];
  bpm: number;
}

export interface SceneObject {
  id: string;
  word: string;
  wordGreek: string;
  emoji: string;
  x: number; // percentage position
  y: number;
}

export interface SceneConfig {
  worldId: WorldId;
  background: string; // CSS gradient/color
  objects: SceneObject[];
  targetWords: string[]; // words the child must find
}

export interface Reward {
  id: string;
  name: string;
  nameEn: string;
  starsRequired: number;
  icon: string;
  category: 'ρούχα' | 'αξεσουάρ' | 'φίλοι' | 'σκηνικά';
  slot?: ItemSlot;
}

export interface LevelResult {
  worldId: WorldId;
  levelIndex: number;
  stars: number;
  correct: number;
  total: number;
  time: number;
}

export type ItemSlot = 'head' | 'body' | 'feet' | 'back' | 'hand';

export interface GameProgress {
  totalStars: number;
  unlockedWorlds: WorldId[];
  levelResults: Record<string, LevelResult>;
  unlockedRewards: string[];
  currentWorld: WorldId | null;
  equippedItems: Record<ItemSlot, string | null>;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
}

export interface UserProfile {
  passwordHash: string;
  progress: GameProgress;
  settings: GameSettings;
}

export interface QuizQuestion {
  type: 'picture-to-word' | 'word-to-picture' | 'listen-and-choose';
  prompt: string;
  correctAnswer: string;
  options: string[];
  picture?: string;
}
