# "Μαθαίνω με την Πέπα" (Learn with Peppa) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Peppa Pig-themed English learning game for Greek girls aged 4-7, with vocabulary, numbers, pronunciation, and sentences across 7 progressive worlds.

**Architecture:** Vite + React 18 + TypeScript SPA with Framer Motion animations, Howler.js audio, localStorage persistence, multi-user auth, and GitHub Pages deployment. Same structural patterns as the maths game at `C:\SAPDevelop\maths`.

**Tech Stack:** Vite, React 18, TypeScript, Framer Motion, Howler.js, CSS Modules, Web Speech API (en-GB), localStorage, gh-pages

---

## File Structure

```
dio/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json
│   └── icons/
│       └── star.svg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/index.ts
│   ├── context/
│   │   ├── GameContext.tsx
│   │   ├── AudioContext.tsx
│   │   └── UserContext.tsx
│   ├── hooks/
│   │   ├── useAudio.ts
│   │   └── useTheme.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── StarDisplay.tsx
│   │   │   ├── Hearts.tsx
│   │   │   ├── Confetti.tsx
│   │   │   ├── FloatingElements.tsx
│   │   │   ├── PeppaCharacter.tsx
│   │   │   ├── MusicToggle.tsx
│   │   │   └── SpeechBubble.tsx
│   │   ├── screens/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── AuthScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── WorldMap.tsx
│   │   │   ├── DaySchedule.tsx
│   │   │   ├── ShowAndTell.tsx
│   │   │   ├── PictureExplorer.tsx
│   │   │   ├── SingAlong.tsx
│   │   │   ├── QuizScreen.tsx
│   │   │   ├── ResultsScreen.tsx
│   │   │   ├── TrophyScreen.tsx
│   │   │   ├── LeaderboardScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── game/
│   │       ├── WordCard.tsx
│   │       ├── PictureScene.tsx
│   │       ├── LyricsDisplay.tsx
│   │       ├── BeatMarkers.tsx
│   │       ├── AnswerButton.tsx
│   │       └── ProgressDots.tsx
│   ├── data/
│   │   ├── worlds.ts
│   │   ├── vocabulary.ts
│   │   ├── songs.ts
│   │   ├── scenes.ts
│   │   └── rewards.ts
│   ├── utils/
│   │   ├── auth.ts
│   │   ├── storage.ts
│   │   ├── synthAudio.ts
│   │   └── themeRandomizer.ts
│   └── styles/
│       ├── global.css
│       └── animations.css
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`

- [ ] **Step 1: Initialize project with package.json**

```json
{
  "name": "learn-with-peppa",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "howler": "^2.2.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/howler": "^2.2.11",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "gh-pages": "^6.1.0"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="el">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/star.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#FF69B4" />
    <link rel="manifest" href="/manifest.json" />
    <link href="https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Comfortaa:wght@400;600;700&family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
    <title>Μαθαίνω με την Πέπα</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create src/main.tsx and src/vite-env.d.ts**

- [ ] **Step 6: Install dependencies and verify dev server starts**

Run: `npm install && npm run dev`
Expected: Dev server starts on localhost

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Types, Data, and Utilities

**Files:**
- Create: `src/types/index.ts`, `src/data/worlds.ts`, `src/data/vocabulary.ts`, `src/data/rewards.ts`, `src/data/songs.ts`, `src/data/scenes.ts`, `src/utils/auth.ts`, `src/utils/storage.ts`, `src/utils/synthAudio.ts`, `src/utils/themeRandomizer.ts`

- [ ] **Step 1: Create types/index.ts**
- [ ] **Step 2: Create data/worlds.ts with all 7 world configs**
- [ ] **Step 3: Create data/vocabulary.ts with all 70+ words**
- [ ] **Step 4: Create data/songs.ts with song lyrics and metadata**
- [ ] **Step 5: Create data/scenes.ts with picture explorer scene definitions**
- [ ] **Step 6: Create data/rewards.ts with all unlockables**
- [ ] **Step 7: Create utils/auth.ts (copy from maths, adapt keys)**
- [ ] **Step 8: Create utils/storage.ts (copy from maths, adapt)**
- [ ] **Step 9: Create utils/synthAudio.ts for Web Speech API (en-GB)**
- [ ] **Step 10: Create utils/themeRandomizer.ts**
- [ ] **Step 11: Commit**

---

### Task 3: Context Providers

**Files:**
- Create: `src/context/GameContext.tsx`, `src/context/UserContext.tsx`, `src/context/AudioContext.tsx`

- [ ] **Step 1: Create UserContext.tsx (adapted from maths)**
- [ ] **Step 2: Create GameContext.tsx with screens and state**
- [ ] **Step 3: Create AudioContext.tsx**
- [ ] **Step 4: Commit**

---

### Task 4: Global Styles and Animations

**Files:**
- Create: `src/styles/global.css`, `src/styles/animations.css`

- [ ] **Step 1: Create global.css with Peppa pink theme variables and base styles**
- [ ] **Step 2: Create animations.css with float, sparkle, pulse, confetti keyframes**
- [ ] **Step 3: Commit**

---

### Task 5: Common Components

**Files:**
- Create: `src/components/common/Button.tsx`, `StarDisplay.tsx`, `Hearts.tsx`, `Confetti.tsx`, `FloatingElements.tsx`, `PeppaCharacter.tsx`, `MusicToggle.tsx`, `SpeechBubble.tsx`

- [ ] **Step 1: Create Button.tsx (pink/girly styled)**
- [ ] **Step 2: Create StarDisplay.tsx**
- [ ] **Step 3: Create Hearts.tsx**
- [ ] **Step 4: Create Confetti.tsx (hearts, butterflies, stars particles)**
- [ ] **Step 5: Create FloatingElements.tsx (hearts, sparkles, butterflies)**
- [ ] **Step 6: Create PeppaCharacter.tsx (CSS Peppa with reactions)**
- [ ] **Step 7: Create MusicToggle.tsx**
- [ ] **Step 8: Create SpeechBubble.tsx**
- [ ] **Step 9: Commit**

---

### Task 6: App Shell and Navigation

**Files:**
- Create: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create App.tsx with providers and router**
- [ ] **Step 2: Update main.tsx to import App and global styles**
- [ ] **Step 3: Verify app renders without errors**
- [ ] **Step 4: Commit**

---

### Task 7: Splash Screen and Auth Screen

**Files:**
- Create: `src/components/screens/SplashScreen.tsx`, `src/components/screens/AuthScreen.tsx`

- [ ] **Step 1: Create SplashScreen with Peppa greeting animation**
- [ ] **Step 2: Create AuthScreen with pink girly login/register**
- [ ] **Step 3: Commit**

---

### Task 8: Home Screen

**Files:**
- Create: `src/components/screens/HomeScreen.tsx`

- [ ] **Step 1: Create HomeScreen with Peppa, PLAY button, navigation**
- [ ] **Step 2: Commit**

---

### Task 9: World Map

**Files:**
- Create: `src/components/screens/WorldMap.tsx`

- [ ] **Step 1: Create WorldMap with 7 worlds, rainbow path, lock/unlock**
- [ ] **Step 2: Commit**

---

### Task 10: Day Schedule (Level Select)

**Files:**
- Create: `src/components/screens/DaySchedule.tsx`

- [ ] **Step 1: Create DaySchedule with Morning/Afternoon/Evening/Bedtime flow**
- [ ] **Step 2: Commit**

---

### Task 11: Show & Tell Screen (Learning)

**Files:**
- Create: `src/components/screens/ShowAndTell.tsx`, `src/components/game/WordCard.tsx`

- [ ] **Step 1: Create WordCard with picture + English + Greek + audio**
- [ ] **Step 2: Create ShowAndTell with word progression and "I said it!" button**
- [ ] **Step 3: Commit**

---

### Task 12: Picture Explorer Screen

**Files:**
- Create: `src/components/screens/PictureExplorer.tsx`, `src/components/game/PictureScene.tsx`

- [ ] **Step 1: Create PictureScene with tappable objects**
- [ ] **Step 2: Create PictureExplorer with guided and free modes**
- [ ] **Step 3: Commit**

---

### Task 13: Sing-Along Screen

**Files:**
- Create: `src/components/screens/SingAlong.tsx`, `src/components/game/LyricsDisplay.tsx`, `src/components/game/BeatMarkers.tsx`

- [ ] **Step 1: Create LyricsDisplay with bouncing ball highlight**
- [ ] **Step 2: Create BeatMarkers with rhythm dots**
- [ ] **Step 3: Create SingAlong with learn mode and fill-in-blank mode**
- [ ] **Step 4: Commit**

---

### Task 14: Quiz Screen (Bedtime)

**Files:**
- Create: `src/components/screens/QuizScreen.tsx`, `src/components/game/AnswerButton.tsx`, `src/components/game/ProgressDots.tsx`

- [ ] **Step 1: Create AnswerButton (pastel pink/purple, press animations)**
- [ ] **Step 2: Create ProgressDots**
- [ ] **Step 3: Create QuizScreen with 10 questions, hearts, timer**
- [ ] **Step 4: Commit**

---

### Task 15: Results Screen

**Files:**
- Create: `src/components/screens/ResultsScreen.tsx`

- [ ] **Step 1: Create ResultsScreen with stars, celebration, unlock notifications**
- [ ] **Step 2: Commit**

---

### Task 16: Trophy, Leaderboard, Settings Screens

**Files:**
- Create: `src/components/screens/TrophyScreen.tsx`, `src/components/screens/LeaderboardScreen.tsx`, `src/components/screens/SettingsScreen.tsx`

- [ ] **Step 1: Create TrophyScreen with rewards grid**
- [ ] **Step 2: Create LeaderboardScreen (adapted from maths)**
- [ ] **Step 3: Create SettingsScreen with volume, toggles, reset**
- [ ] **Step 4: Commit**

---

### Task 17: Audio System Integration

**Files:**
- Create: `src/hooks/useAudio.ts`
- Modify: `src/context/AudioContext.tsx`

- [ ] **Step 1: Implement useAudio hook with Howler.js + Web Speech API (en-GB)**
- [ ] **Step 2: Add synthesized background music per world**
- [ ] **Step 3: Commit**

---

### Task 18: Theme Randomizer

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: Implement useTheme hook that randomly picks Classic/Sparkle/Adventure**
- [ ] **Step 2: Apply theme to all screens**
- [ ] **Step 3: Commit**

---

### Task 19: PWA and Deployment Setup

**Files:**
- Create: `public/manifest.json`, `public/icons/star.svg`

- [ ] **Step 1: Create manifest.json for PWA**
- [ ] **Step 2: Create star.svg icon**
- [ ] **Step 3: Configure gh-pages deployment**
- [ ] **Step 4: Build and verify production build works**
- [ ] **Step 5: Deploy to GitHub Pages**
- [ ] **Step 6: Commit**

---

### Task 20: Final Polish and Testing

- [ ] **Step 1: Test full flow: auth → home → world → all level types → results**
- [ ] **Step 2: Test on mobile viewport (375px)**
- [ ] **Step 3: Verify UK accent pronunciation works**
- [ ] **Step 4: Verify random theme rotation**
- [ ] **Step 5: Test leaderboard with multiple users**
- [ ] **Step 6: Final commit**
