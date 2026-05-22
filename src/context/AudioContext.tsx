import { createContext, useContext, useCallback, useRef, ReactNode, useEffect } from 'react';
import { Howl } from 'howler';
import { useGame } from './GameContext';

interface AudioContextType {
  playCorrect: () => void;
  playWrong: () => void;
  playLevelComplete: () => void;
  playStar: () => void;
  playButton: () => void;
  playWorldUnlock: () => void;
  toggleMusic: () => void;
  setVolume: (vol: number) => void;
}

const AudioCtx = createContext<AudioContextType | null>(null);

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContext();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

export function unlockAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const { state } = useGame();
  const musicRef = useRef<Howl | null>(null);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!state.settings.sfxEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = state.settings.volume * 0.3;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch { /* audio not available */ }
  }, [state.settings.sfxEnabled, state.settings.volume]);

  const playCorrect = useCallback(() => {
    playTone(880, 0.15);
    setTimeout(() => playTone(1100, 0.15), 100);
    setTimeout(() => playTone(1320, 0.2), 200);
  }, [playTone]);

  const playWrong = useCallback(() => {
    playTone(300, 0.3, 'triangle');
  }, [playTone]);

  const playLevelComplete = useCallback(() => {
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 120);
    setTimeout(() => playTone(784, 0.15), 240);
    setTimeout(() => playTone(1047, 0.3), 360);
  }, [playTone]);

  const playStar = useCallback(() => {
    playTone(1200, 0.1);
    setTimeout(() => playTone(1500, 0.15), 80);
  }, [playTone]);

  const playButton = useCallback(() => {
    playTone(600, 0.05);
  }, [playTone]);

  const playWorldUnlock = useCallback(() => {
    playTone(440, 0.1);
    setTimeout(() => playTone(554, 0.1), 100);
    setTimeout(() => playTone(659, 0.1), 200);
    setTimeout(() => playTone(880, 0.3), 300);
  }, [playTone]);

  const toggleMusic = useCallback(() => {
    if (musicRef.current) {
      if (musicRef.current.playing()) {
        musicRef.current.pause();
      } else {
        musicRef.current.play();
      }
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    if (musicRef.current) musicRef.current.volume(vol);
  }, []);

  useEffect(() => {
    setVolume(state.settings.volume);
  }, [state.settings.volume, setVolume]);

  return (
    <AudioCtx.Provider value={{ playCorrect, playWrong, playLevelComplete, playStar, playButton, playWorldUnlock, toggleMusic, setVolume }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioCtx);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
