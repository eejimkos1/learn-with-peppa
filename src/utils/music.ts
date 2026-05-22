const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99, A5: 880.00,
};

type Note = { note: string; duration: number };

// Cheerful, sparkly music-box melody — cute and playful for little girls
const MELODY_A: Note[] = [
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'C5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.5 },
  { note: 'D5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'D5', duration: 0.5 },
  { note: 'E5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'G5', duration: 0.5 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'C5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'C5', duration: 0.75 },
];

// Twinkle-style second part
const MELODY_B: Note[] = [
  { note: 'C5', duration: 0.25 },
  { note: 'C5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'A5', duration: 0.25 },
  { note: 'A5', duration: 0.25 },
  { note: 'G5', duration: 0.5 },
  { note: 'F5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'C5', duration: 0.5 },
  { note: 'G5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.5 },
  { note: 'G5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.5 },
  { note: 'C5', duration: 0.25 },
  { note: 'C5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'G5', duration: 0.25 },
  { note: 'A5', duration: 0.25 },
  { note: 'A5', duration: 0.25 },
  { note: 'G5', duration: 0.5 },
  { note: 'F5', duration: 0.25 },
  { note: 'F5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'E5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'D5', duration: 0.25 },
  { note: 'C5', duration: 0.75 },
];

const FULL_MELODY = [...MELODY_A, ...MELODY_B];

let musicCtx: AudioContext | null = null;
let isPlaying = false;
let stopFlag = false;
let masterGain: GainNode | null = null;
let currentVolume = 0.04;
let loopTimer: ReturnType<typeof setTimeout> | null = null;

function getMusicContext(): AudioContext | null {
  try {
    if (!musicCtx) {
      musicCtx = new AudioContext();
    }
    if (musicCtx.state === 'suspended') {
      musicCtx.resume();
    }
    return musicCtx;
  } catch {
    return null;
  }
}

function playMusicBoxNote(ctx: AudioContext, freq: number, startTime: number, duration: number, gain: GainNode): void {
  // Music box: sine + soft harmonics for sparkly sound
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const noteGain = ctx.createGain();

  osc1.type = 'sine';
  osc1.frequency.value = freq;

  // Soft high harmonic for sparkle
  osc2.type = 'sine';
  osc2.frequency.value = freq * 3;

  const attackTime = 0.008;
  noteGain.gain.setValueAtTime(0, startTime);
  noteGain.gain.linearRampToValueAtTime(0.25, startTime + attackTime);
  noteGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  const harmGain = ctx.createGain();
  harmGain.gain.value = 0.05;

  osc1.connect(noteGain);
  osc2.connect(harmGain);
  harmGain.connect(noteGain);
  noteGain.connect(gain);

  osc1.start(startTime);
  osc1.stop(startTime + duration);
  osc2.start(startTime);
  osc2.stop(startTime + duration);
}

function scheduleLoop(ctx: AudioContext, gain: GainNode, startTime: number): number {
  const tempo = 108;
  const beatDuration = 60 / tempo;
  let time = startTime;

  for (const { note, duration } of FULL_MELODY) {
    if (stopFlag) break;
    const freq = NOTE_FREQUENCIES[note];
    const noteDur = duration * beatDuration;
    playMusicBoxNote(ctx, freq, time, noteDur * 0.85, gain);
    time += noteDur;
  }

  return time;
}

export function startMusic(): void {
  if (isPlaying) return;
  const ctx = getMusicContext();
  if (!ctx) return;

  stopFlag = false;
  isPlaying = true;

  masterGain = ctx.createGain();
  masterGain.gain.value = currentVolume;
  masterGain.connect(ctx.destination);

  let nextStart = ctx.currentTime + 0.1;

  function loop() {
    if (stopFlag || !masterGain) {
      isPlaying = false;
      return;
    }
    const loopEnd = scheduleLoop(ctx!, masterGain!, nextStart);
    nextStart = loopEnd + 1.0;
    const waitMs = (loopEnd - ctx!.currentTime - 2) * 1000;
    loopTimer = setTimeout(loop, Math.max(waitMs, 1000));
  }

  loop();
}

export function stopMusic(): void {
  stopFlag = true;
  isPlaying = false;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (masterGain && musicCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(0, musicCtx.currentTime + 0.5);
    } catch { /* ignore */ }
    setTimeout(() => { masterGain = null; }, 600);
  }
}

export function setMusicVolume(vol: number): void {
  currentVolume = vol * 0.04;
  if (masterGain && musicCtx) {
    try {
      masterGain.gain.setValueAtTime(currentVolume, musicCtx.currentTime);
    } catch { /* ignore */ }
  }
}

export function isMusicPlaying(): boolean {
  return isPlaying;
}

export function duckMusic(): void {
  if (masterGain && musicCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(currentVolume * 0.3, musicCtx.currentTime + 0.3);
    } catch { /* ignore */ }
  }
}

export function unduckMusic(): void {
  if (masterGain && musicCtx) {
    try {
      masterGain.gain.linearRampToValueAtTime(currentVolume, musicCtx.currentTime + 0.3);
    } catch { /* ignore */ }
  }
}

export function unlockMusicContext(): void {
  const ctx = getMusicContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}
