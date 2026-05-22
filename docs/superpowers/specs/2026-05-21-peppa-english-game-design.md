# "Μαθαίνω με την Πέπα" (Learn with Peppa) — Game Design Spec

## Overview

A mobile-friendly web game for Greek girls aged 4-7 to learn English vocabulary, numbers, pronunciation, and simple sentences. Peppa Pig is the main teacher character, guiding children through 7 themed worlds. Hosted on GitHub Pages. UI bilingual (Greek + English, with Greek fading out as difficulty increases).

## Target User

- Girls aged 4-7 living in Greece
- Starting to learn English (beginner level)
- Limited or no reading ability in English
- Interests: Peppa Pig, princesses, colors, animals, singing
- Device: phone/tablet (mobile-first)
- Language: Greek as native, English as target

## Platform & Tech Stack

- **Vite + React 18** with TypeScript
- **Framer Motion** for animations
- **Howler.js** for audio/music management
- **CSS Modules** with CSS custom properties for theming
- **localStorage** for progress persistence
- **Multi-user auth** (same approach as maths game — name + 4-8 char password, SHA-256 hashed)
- **Leaderboard** (local multi-player ranking by stars)
- **GitHub Pages** deployment via `gh-pages` package
- **PWA manifest** — installable on phone home screen
- **Responsive:** 375px+ width (iPhone SE and up)
- **No backend** — purely client-side
- **All English audio in UK/British accent** — matching Peppa Pig's British English

## Game Concept

Peppa is the English teacher. Each world is a "day with Peppa" at a different location. The child progresses through Morning (learn), Afternoon (explore), Evening (sing), and Bedtime (quiz). The game teaches 70+ English words, numbers 1-20, and progresses from single words to short sentences across 7 worlds.

## Visual Design — "Peppa Sparkle Princess"

### Aesthetic

Girly, pink, sparkly, Peppa-themed. Three visual styles rotate RANDOMLY per world/level entry:

1. **Classic Peppa:** Sky blue, grass green, bold primary colors, Peppa's house/hill silhouette
2. **Sparkle Princess:** Hot pink/magenta gradients, sparkles, gold accents, crowns, fairy dust
3. **Adventure Map:** Soft pastels, storybook/watercolor feel, gentle clouds, illustrated borders

### Color Palette

| Element | Value |
|---------|-------|
| Primary pink | `#FF69B4` (hot pink) |
| Primary magenta | `#E91E63` |
| Peppa pink | `#FFB6C1` (light pink) |
| Sparkle gold | `#FFD700` |
| Lavender | `#CE93D8` |
| Sky blue | `#87CEEB` |
| Grass green | `#4CAF50` |
| Background base | `#FFF0F5` (lavender blush — light!) or `#1a0022` (dark sparkle mode) |
| Text | Dark mode: white. Light mode: `#4A0028` (deep pink-brown) |
| Success | `#4CAF50` with sparkle burst |
| Error | `#FF8A80` (soft coral, never scary) |

### Typography (Google Fonts, Greek support)

- **Headings:** "Pacifico" or "Bubblegum Sans" — round, playful, bubbly
- **Body:** "Comfortaa" — rounded, modern, readable in Greek + English
- **Numbers/English words:** "Fredoka One" — bold, fun, child-friendly

### Peppa Character

- Peppa SVG/PNG visible on EVERY screen
- Peppa reacts to answers (happy jump for correct, encouraging wave for wrong)
- Peppa wears different outfits per world (beach hat, school bag, party dress, etc.)
- Speech bubble with bilingual hints
- Peppa's "oink!" and snort-laugh on celebrations

### Floating Elements (always present)

- Hearts (💖), stars (⭐), butterflies (🦋), sparkles (✨), rainbows (🌈)
- Flowers (🌸), muddy puddle splashes, musical notes (🎵)
- Randomly generated per screen, floating with CSS animations

### Animations (Framer Motion + CSS)

**Correct Answer:**
- Peppa jumps and claps
- Pink confetti burst (hearts, stars, flowers)
- Muddy puddle splash animation
- "+1 ⭐" floats up
- "Oink oink!" sound

**Wrong Answer:**
- Peppa waves encouragingly
- Soft pink glow (never red/scary)
- Text: "Προσπάθησε ξανά! Try again! 💪"
- Gentle "womp" sound

**Level Complete:**
- Full-screen confetti (hearts, butterflies, Peppa faces)
- Stars fly in with "pling pling pling"
- Peppa does a happy snort-laugh dance
- Muddy puddle jumping celebration

**Page Transitions:**
- Sparkle trail + slide between screens
- Rainbow whoosh effect

## The 7 Worlds

### World 1: Το Σπίτι της Πέπα (Peppa's House)
- **Topic:** Numbers 1-10
- **Words:** one, two, three, four, five, six, seven, eight, nine, ten
- **Context:** Counting things in Peppa's house (windows, stairs, toys, family)
- **Greek:** Shown alongside English for all words
- **Visual:** Yellow house, red roof, green hill, blue sky (classic Peppa)
- **Song:** "One, Two, Three, Four, Five — Once I Caught a Fish Alive"
- **Music:** Cheerful recorder melody (Peppa theme style)

### World 2: Το Πάρκο (The Park)
- **Topic:** Colors & Animals
- **Words:** red, blue, green, yellow, pink, cat, dog, bird, butterfly, frog
- **Context:** Playing in the park, spotting animals and their colors
- **Greek:** Shown alongside English
- **Visual:** Bright green grass, playground equipment, ducks in pond, flowers
- **Song:** "I Can Sing a Rainbow"
- **Music:** Gentle guitar with bird chirps

### World 3: Το Σχολείο της Πέπα (Peppa's School)
- **Topic:** Body & Clothes
- **Words:** head, hand, nose, eyes, mouth, dress, shoes, hat, bag, hair
- **Context:** Getting dressed for school, body parts, morning routine
- **Greek:** Hints reduced (shown smaller, fades after a few seconds)
- **Visual:** Classroom, cubbies, Madame Gazelle's desk, school bus
- **Song:** "Head, Shoulders, Knees and Toes"
- **Music:** School bell jingle, playful piano

### World 4: Το Σούπερ Μάρκετ (The Supermarket)
- **Topic:** Numbers 11-20 + Food
- **Words:** eleven through twenty + apple, banana, milk, bread, cake
- **Context:** Shopping with Mummy Pig, counting items into basket
- **Greek:** Less shown — only on first introduction, then fades
- **Visual:** Colourful supermarket aisles, shopping trolley, fruit displays
- **Song:** "Ten Green Bottles" (adapted for food items)
- **Music:** Bouncy shopping muzak style

### World 5: Η Παραλία (The Beach)
- **Topic:** Simple Phrases
- **Words/Phrases:** "I like...", "I can see...", "This is a...", sun, sea, sand, shell, boat, fish, ice cream
- **Context:** Beach day with Peppa's family, building sandcastles
- **Greek:** No Greek hints — English only
- **Visual:** Sandy beach, blue waves, seagulls, beach umbrella, sandcastle
- **Song:** "The Wheels on the Bus" (adapted: "The waves at the beach go splash splash splash")
- **Music:** Tropical ukulele with wave sounds

### World 6: Ο Ζωολογικός Κήπος (The Zoo)
- **Topic:** Longer Phrases
- **Phrases:** "The lion is big", "I like the penguin", "The monkey is funny", "Can you see the elephant?"
- **Extra words:** lion, elephant, monkey, penguin, giraffe, big, small, funny, tall, fast
- **Context:** Zoo trip, describing animals with adjectives
- **Greek:** No hints
- **Visual:** Zoo enclosures, tropical plants, animal silhouettes, zoo map
- **Song:** "Walking Through the Jungle" (animal actions)
- **Music:** Adventurous safari drums with animal sounds

### World 7: Το Πάρτι της Πέπα (Peppa's Party)
- **Topic:** Short Sentences & Social Phrases
- **Sentences:** "Happy birthday!", "Can I have cake?", "Let's play together!", "Thank you!", "My name is...", "I am [age] years old"
- **Extra words:** cake, balloon, present, friend, happy, dance, play, sing
- **Context:** Birthday party, celebrations, talking to friends
- **Greek:** No hints — full English immersion
- **Visual:** Party decorations, balloons, cake, disco ball, bunting
- **Song:** "Happy Birthday" + "If You're Happy and You Know It"
- **Music:** Party celebration music, confetti sounds

## Level Structure — "A Day with Peppa"

Each world has 7 levels following Peppa's daily routine:

### Morning — Peppa Shows & Tells (Levels 1-2)
- Peppa introduces 5 words per level (10 per world total)
- Each word shown as: Picture + English word + Greek translation + Audio pronunciation
- Child listens to Peppa say the word
- Child taps "I said it! ⭐" button after repeating aloud
- After all 5 words, a quick 3-question mini-review (pick the picture that matches the word)
- Pace: slow, lots of repetition, no time pressure
- Early worlds (1-3): Greek shown prominently alongside
- Later worlds (5-7): English only

### Afternoon — Picture Explorer (Levels 3-4)
- Full Peppa scene displayed (e.g., Peppa's kitchen, the park playground)
- Level 3 (guided): Peppa asks "Can you find the [word]?" — child taps objects to hear name, must find 5 target words
- Level 4 (free explore): Scene shown — child types/selects as many English words as they can identify
  - For non-readers: grid of picture options to tap instead of typing
  - Each correct identification = 1 point
  - Bonus points for finding words beyond the 5 taught ones (rewarding prior knowledge)
  - "Wow! You know extra words! +2 bonus!" encouragement
- Scenes are detailed, interactive, with hidden objects to discover

### Evening — Peppa's Sing-Along (Levels 5-6)
- Level 5 (learn): Full song plays with lyrics displayed, bouncing ball/karaoke style highlight
  - Child taps screen in rhythm (beat markers at bottom)
  - Peppa sings along, child follows
  - Replay available unlimited times
- Level 6 (fill-in): Song plays again but key vocabulary words are blanked out (shown as "___")
  - Multiple choice: 3 picture/word options per blank
  - Must fill in correctly to continue the song
  - Wrong answer: song pauses, Peppa says "Hmm, try this one!"
  - Rhythm points for tapping on beat even during blanks

### Bedtime — Quiz (Level 7)
- 10 multiple-choice questions mixing ALL words from the world
- Question types rotate:
  - "Which picture is [word]?" (4 pictures, tap correct)
  - "What is this?" (picture shown, 4 English word options)
  - "Listen and choose" (audio plays, pick matching picture)
  - "Match!" (drag word to picture — later worlds only)
- 3 hearts system (wrong = lose heart, 0 = retry)
- 1-3 stars based on accuracy
- Timer: none for worlds 1-3, gentle 15-second timer per question for worlds 4-7
- Encouraging feedback regardless of result

## Music & Sound System

### Background Music Per World
- **Peppa's House:** Cheerful recorder + xylophone (classic Peppa theme style)
- **The Park:** Gentle acoustic guitar + bird chirps
- **Peppa's School:** Playful piano + school bell chimes
- **The Supermarket:** Bouncy muzak + shopping trolley sounds
- **The Beach:** Tropical ukulele + ocean waves
- **The Zoo:** Safari drums + animal ambient sounds
- **Peppa's Party:** Upbeat party music + poppers + confetti sounds

Music implemented via Howler.js with Web Audio API synthesized tones + embedded compressed .mp3 clips (total <500KB).

### Word Pronunciation
- Primary: Web Speech API with `lang: 'en-GB'` (British English) for all vocabulary
- Fallback: Pre-recorded .mp3 clips for key words (ensures consistent UK accent)
- Speech rate: slightly slower than normal (rate: 0.85) for young learners
- Each word can be replayed unlimited times by tapping the speaker icon

### Sound Effects
| Event | Sound |
|-------|-------|
| Correct answer | "Oink oink!" + sparkle chime |
| Wrong answer | Soft gentle "womp" (never harsh) |
| Word played | Clear British English pronunciation (UK accent — matching Peppa!) |
| Level complete | Peppa snort-laugh + applause |
| Star earned | Individual "pling!" per star |
| Button tap | Soft bubble pop |
| World unlock | Muddy puddle SPLASH + fanfare |
| Heart lost | Gentle "aww" |
| Song rhythm tap | Soft "tap" on beat |
| Bonus word found | Excited "ooh!" + sparkle |

### Music Controls
- Mute/unmute toggle always visible (pink musical note icon)
- Volume slider in settings
- Music auto-plays after first user interaction (browser policy)

## Adaptive Difficulty

### Greek Support Fading
| World | Greek Visibility |
|-------|-----------------|
| 1-2 | Full: Greek shown same size alongside English |
| 3 | Reduced: Greek shown smaller, fades after 3 seconds |
| 4 | Minimal: Greek only on first introduction |
| 5-7 | None: English only |

### Speed & Complexity
| World | Pace | Content |
|-------|------|---------|
| 1-2 | Very slow, unlimited time | Single words, numbers |
| 3-4 | Slow, gentle pace | Words + some combos ("red dress") |
| 5-6 | Moderate | 2-3 word phrases |
| 7 | Normal | Full short sentences |

### Adaptive Logic
- Track accuracy per world in localStorage
- If accuracy < 50% on any level: offer to replay with extra hints
- If accuracy > 90%: show "Super Star!" badge, suggest harder bonus round
- Never block progress — child can always retry or move forward
- "Peppa's Tip" appears if stuck: audio hint + highlight correct area

## Reward System

### Stars
- 1-3 stars per level based on accuracy:
  - 3 stars: 9-10 correct (out of 10)
  - 2 stars: 7-8 correct
  - 1 star: 5-6 correct (minimum to pass)
  - 0 stars (fail): <5 correct, must retry
- Maximum: 7 worlds × 7 levels × 3 stars = 147 possible stars

### Unlockables (earned by total stars)
| Stars | Reward | Greek Name |
|-------|--------|-----------|
| 5 | Peppa's Red Dress | Κόκκινο φόρεμα Πέπα |
| 10 | Golden Crown | Χρυσό στέμμα |
| 15 | Fairy Wings | Φτερά νεράιδας |
| 20 | Rainbow Boots | Μπότες ουράνιο τόξο |
| 30 | Peppa's Microphone | Μικρόφωνο Πέπα |
| 40 | Unicorn Friend | Μονόκερος φίλος |
| 50 | Princess Castle Background | Κάστρο πριγκίπισσας |
| 60 | Peppa's Ballet Tutu | Τουτού μπαλέτου |
| 80 | Diamond Tiara | Τιάρα με διαμάντια |
| 100 | SUPERSTAR Peppa Outfit | Σούπερ Σταρ Πέπα! |
| 120 | Rainbow World unlocked | Κόσμος ουράνιου τόξου |
| 147 | Secret: Peppa's Golden Muddy Puddle | Χρυσή λασπόλακκα! (100%) |

### Trophy/Collection Screen
- Grid of rewards as cards
- Locked: pink silhouette with "?"
- Unlocked: full color + sparkle animation
- Peppa wears unlocked items on home screen

## UI Screens

### 1. Splash Screen
- Peppa waving with speech bubble "Hello! Γεια σου!"
- Game title in pink script with shimmer animation
- Pink gradient background with floating hearts and stars
- Progress bar styled as pink wand filling up

### 2. Auth Screen (Login/Register)
- Peppa at center greeting
- Pink/magenta gradient background
- Bubbly input fields with heart icons
- "Είσοδος / Login 🎉" button in hot pink
- Same multi-user system as maths game (up to 10 users)

### 3. Home Screen
- Peppa (wearing unlocked items) with idle animations
- "ΠΑΙΞΕ! / PLAY!" button — large, pink, glowing, pulsing
- Stars counter (top corner with bounce)
- Buttons: Settings ⚙️, Trophies 🏆, Leaderboard 🏆
- Floating: hearts, butterflies, sparkles, musical notes
- Current world badge

### 4. World Map
- Vertical scrollable path (like maths game)
- 7 world circles connected by rainbow-sparkle path
- Each world: themed icon + progress ring
- Locked worlds: pink padlock + shimmer
- Current world: glowing pulse + Peppa standing there
- Background: gradient sky with clouds, butterflies, rainbows

### 5. Day Schedule (Level Select)
- Shows 4 time-of-day sections for current world
- Morning ☀️ / Afternoon 🌤️ / Evening 🌅 / Bedtime 🌙
- Each section shows 1-2 level bubbles
- Completed: stars shown, golden glow
- Current: bouncing, Peppa pointing at it
- Locked: soft grey with tiny lock

### 6. Show & Tell Screen (Learning)
- Large picture of word (center)
- English word (large, pink/magenta, bold)
- Greek word (below, smaller — size varies by world)
- Audio play button (speaker icon, bounces when tapped)
- Peppa in corner with speech bubble
- "I said it! ⭐" button at bottom
- Progress dots showing word X of 5
- Swipe or tap arrow for next word

### 7. Picture Explorer Screen
- Full Peppa scene (illustrated, interactive)
- Tappable objects highlighted with subtle shimmer
- Word collection bar at bottom (found words appear as pills)
- Score counter: "Found: 3/5 + 2 bonus!"
- Peppa gives hints if stuck (speech bubble: "Look near the tree!")
- Timer (later worlds only): gentle hourglass with sand animation

### 8. Sing-Along Screen
- Lyrics displayed large and clear (bouncing ball highlights current word)
- Peppa dancing along at bottom
- Beat markers (pink dots that light up on rhythm)
- Fill-in-blank mode: "_____" shown, 3 options appear below
- Musical notes floating in background
- Progress bar showing song position

### 9. Quiz Screen (Bedtime)
- **Top bar:** Hearts (💖💖💖) | Stars counter | "Bedtime Quiz 🌙" | Music toggle
- **Center card:** Frosted pink glass card with rounded corners
- **Question:** Large text + picture (if applicable)
- **Answer options:** 4 large buttons in different pastel pinks/purples
- **Progress:** Pink dots at bottom (question X of 10)
- **Peppa:** Small corner version reacting to answers
- **Background:** Night sky with stars, moon, fireflies (calming)

### 10. Results Screen
- Stars fly in with individual fanfare (1-3)
- Peppa celebrates (snort-laugh, muddy puddle jump)
- Stats: "Σωστές/Correct: 8/10" | "Bonus: +2 ⭐"
- Encouragement (bilingual):
  - 3 stars: "PERFECT! ΤΕΛΕΙΑ! 🌟 Peppa is SO proud!"
  - 2 stars: "Very good! Πολύ καλά! 💫"
  - 1 star: "Good try! Μπράβο! Keep going! ✨"
- Unlock notification with pink chest opening animation
- Buttons: "Again 🔄" | "Next ➡️" | "Map 🗺️"

### 11. Leaderboard Screen
- Same design as maths game but pink/Peppa themed
- Rankings by total stars
- Current user highlighted in pink glow
- Medals: 🥇🥈🥉

### 12. Settings Screen
- Volume slider (pink sparkle bar)
- Music on/off (musical note toggle)
- Sound effects on/off
- Visual theme preference (or keep random)
- Reset progress (with confirmation)
- Credits

## Deployment

- **New GitHub repository** (separate from maths game)
- `gh-pages` branch for deployment
- Accessible via `https://<username>.github.io/<repo-name>/`
- PWA manifest for "Add to Home Screen" on mobile
- Service worker for offline capability

## File Structure

```
dio/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── audio/
│   │   ├── bg-house.mp3
│   │   ├── bg-park.mp3
│   │   ├── bg-school.mp3
│   │   ├── bg-supermarket.mp3
│   │   ├── bg-beach.mp3
│   │   ├── bg-zoo.mp3
│   │   ├── bg-party.mp3
│   │   ├── songs/
│   │   │   ├── fish-alive.mp3
│   │   │   ├── rainbow.mp3
│   │   │   ├── head-shoulders.mp3
│   │   │   ├── green-bottles.mp3
│   │   │   ├── waves-beach.mp3
│   │   │   ├── walking-jungle.mp3
│   │   │   └── happy-birthday.mp3
│   │   ├── words/
│   │   │   ├── one.mp3
│   │   │   ├── two.mp3
│   │   │   └── ... (all vocabulary audio)
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── level-complete.mp3
│   │   ├── star.mp3
│   │   └── button.mp3
│   ├── images/
│   │   ├── peppa/
│   │   │   ├── peppa-happy.svg
│   │   │   ├── peppa-wave.svg
│   │   │   ├── peppa-clap.svg
│   │   │   ├── peppa-dance.svg
│   │   │   └── peppa-teach.svg
│   │   ├── scenes/
│   │   │   ├── house.svg
│   │   │   ├── park.svg
│   │   │   ├── school.svg
│   │   │   ├── supermarket.svg
│   │   │   ├── beach.svg
│   │   │   ├── zoo.svg
│   │   │   └── party.svg
│   │   └── vocabulary/
│   │       ├── one.svg
│   │       ├── two.svg
│   │       └── ... (all word pictures)
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   └── index.ts
│   ├── context/
│   │   ├── GameContext.tsx
│   │   ├── AudioContext.tsx
│   │   └── UserContext.tsx
│   ├── hooks/
│   │   ├── useGameProgress.ts
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
│       ├── variables.css
│       ├── animations.css
│       └── themes/
│           ├── classic.module.css
│           ├── sparkle.module.css
│           └── adventure.module.css
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-21-peppa-english-game-design.md
```
