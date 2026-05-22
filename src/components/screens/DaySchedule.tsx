import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { Screen, WorldId } from '../../types';

interface Phase {
  id: string;
  timeEmoji: string;
  timeLabel: string;
  timeGreek: string;
  activityName: string;
  activityGreek: string;
  levels: number[];
  screen: Screen;
  bgGradient: string;
  accentColor: string;
}

const PHASES: Phase[] = [
  {
    id: 'morning',
    timeEmoji: '🌅',
    timeLabel: 'Morning',
    timeGreek: 'Πρωί',
    activityName: "Peppa Shows & Tells",
    activityGreek: 'Η Πέπα Δείχνει & Λέει',
    levels: [0, 1],
    screen: 'showAndTell',
    bgGradient: 'linear-gradient(135deg, #FFE0A3 0%, #FFCC80 100%)',
    accentColor: '#FF8C00',
  },
  {
    id: 'afternoon',
    timeEmoji: '☀️',
    timeLabel: 'Afternoon',
    timeGreek: 'Μεσημέρι',
    activityName: 'Picture Explorer',
    activityGreek: 'Εξερευνήτρια Εικόνων',
    levels: [2, 3],
    screen: 'pictureExplorer',
    bgGradient: 'linear-gradient(135deg, #FFF9C4 0%, #F9E04B 100%)',
    accentColor: '#F9A825',
  },
  {
    id: 'playtime',
    timeEmoji: '🎯',
    timeLabel: 'Playtime',
    timeGreek: 'Ώρα Παιχνιδιού',
    activityName: 'What Belongs Here?',
    activityGreek: 'Τι Ταιριάζει Εδώ;',
    levels: [4, 5],
    screen: 'scenePicker',
    bgGradient: 'linear-gradient(135deg, #B3E5FC 0%, #4FC3F7 100%)',
    accentColor: '#0288D1',
  },
  {
    id: 'wordplay',
    timeEmoji: '🔤',
    timeLabel: 'Word Play',
    timeGreek: 'Λεξοπαιχνίδι',
    activityName: 'Hangman',
    activityGreek: 'Κρεμάλα',
    levels: [6, 7],
    screen: 'hangman',
    bgGradient: 'linear-gradient(135deg, #C8E6C9 0%, #66BB6A 100%)',
    accentColor: '#388E3C',
  },
  {
    id: 'evening',
    timeEmoji: '🌆',
    timeLabel: 'Evening',
    timeGreek: 'Απόγευμα',
    activityName: "Peppa's Sing-Along",
    activityGreek: 'Τραγουδάμε με την Πέπα',
    levels: [8, 9],
    screen: 'singAlong',
    bgGradient: 'linear-gradient(135deg, #FFB6C1 0%, #E91E63 100%)',
    accentColor: '#E91E63',
  },
  {
    id: 'bedtime',
    timeEmoji: '🌙',
    timeLabel: 'Bedtime',
    timeGreek: 'Νύχτα',
    activityName: 'Bedtime Quiz',
    activityGreek: 'Κουίζ Καληνύχτας',
    levels: [10],
    screen: 'quiz',
    bgGradient: 'linear-gradient(135deg, #C3A0E8 0%, #7B1FA2 100%)',
    accentColor: '#7B1FA2',
  },
];

function isLevelAvailable(levelIndex: number, worldId: WorldId, levelResults: Record<string, { stars: number }>): boolean {
  if (levelIndex === 0) return true;
  for (let i = 0; i < levelIndex; i++) {
    const key = `${worldId}-${i}`;
    if (!levelResults[key] || levelResults[key].stars < 1) return false;
  }
  return true;
}

function getPhaseStars(levels: number[], worldId: WorldId, levelResults: Record<string, { stars: number }>): number {
  return levels.reduce((sum, lvl) => {
    const key = `${worldId}-${lvl}`;
    return sum + (levelResults[key]?.stars ?? 0);
  }, 0);
}

export function DaySchedule() {
  const { state, dispatch } = useGame();
  const { currentWorld, progress } = state;

  const worldConfig = WORLDS.find((w) => w.id === currentWorld);

  function handleBack() {
    dispatch({ type: 'SET_SCREEN', screen: 'worldMap' });
  }

  function handlePhaseClick(phase: Phase) {
    const firstAvailable = phase.levels.find(lvl =>
      isLevelAvailable(lvl, currentWorld as WorldId, progress.levelResults)
    );
    if (firstAvailable === undefined) return;

    dispatch({ type: 'SELECT_LEVEL', level: firstAvailable });
    dispatch({ type: 'SET_SCREEN', screen: phase.screen });
  }

  const worldBg = worldConfig?.colors.background ?? 'linear-gradient(160deg, #FFB6C1, #CE93D8)';
  const worldPrimary = worldConfig?.colors.primary ?? '#E91E63';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: worldBg,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(10px, 2.5vh, 14px) clamp(14px, 4vw, 20px)',
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(255,255,255,0.4)',
          flexShrink: 0,
        }}
      >
        <motion.button
          onClick={handleBack}
          whileTap={{ scale: 0.9 }}
          style={{
            background: `linear-gradient(135deg, ${worldPrimary}, ${worldConfig?.colors.secondary ?? '#FF69B4'})`,
            border: 'none',
            borderRadius: '50%',
            width: 'clamp(34px, 9vw, 42px)',
            height: 'clamp(34px, 9vw, 42px)',
            fontSize: 'clamp(14px, 4vw, 18px)',
            cursor: 'pointer',
            color: 'white',
            boxShadow: `0 3px 12px ${worldPrimary}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </motion.button>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(16px, 4.5vw, 20px)',
              color: worldPrimary,
            }}
          >
            {worldConfig ? `${worldConfig.icon} ${worldConfig.name}` : '🗓️ Πρόγραμμα'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(80,40,60,0.7)' }}>
            {worldConfig?.nameEn ?? 'Day Schedule'}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '13px',
            color: '#FF8C00',
            fontWeight: 700,
          }}
        >
          ⭐ {progress.totalStars}
        </div>
      </motion.div>

      {/* PHASE CARDS */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'clamp(12px, 3vh, 16px) clamp(12px, 3vw, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(12px, 3vh, 18px)',
          zIndex: 5,
        }}
      >
        {PHASES.map((phase, i) => {
          const phaseAvailable = isLevelAvailable(phase.levels[0], currentWorld as WorldId, progress.levelResults);
          const phaseStars = getPhaseStars(phase.levels, currentWorld as WorldId, progress.levelResults);
          const maxStars = phase.levels.length * 3;
          const allDone = phaseStars >= maxStars;

          if (phaseAvailable) {
            return (
              <motion.button
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 250, damping: 20 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handlePhaseClick(phase)}
                style={{
                  width: '100%',
                  background: phase.bgGradient,
                  border: `3px solid ${phase.accentColor}55`,
                  borderRadius: '20px',
                  padding: 'clamp(16px, 4vh, 24px) clamp(16px, 4vw, 20px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(12px, 4vw, 18px)',
                  cursor: 'pointer',
                  boxShadow: `0 6px 24px ${phase.accentColor}40`,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 'clamp(32px, 10vw, 44px)' }}>
                  {phase.timeEmoji}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(15px, 4.2vw, 19px)',
                    color: phase.accentColor,
                    fontWeight: 700,
                  }}>
                    {phase.timeGreek} · {phase.timeLabel}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(13px, 3.5vw, 16px)',
                    color: 'rgba(0,0,0,0.7)',
                    marginTop: '2px',
                  }}>
                    {phase.activityGreek}
                  </div>
                  <div style={{
                    fontSize: 'clamp(11px, 2.8vw, 13px)',
                    color: 'rgba(0,0,0,0.5)',
                    fontFamily: 'var(--font-body)',
                    fontStyle: 'italic',
                  }}>
                    {phase.activityName}
                  </div>
                  {allDone && (
                    <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                      {Array.from({ length: 3 }).map((_, si) => (
                        <span key={si} style={{ fontSize: '14px' }}>⭐</span>
                      ))}
                      <span style={{ fontSize: '12px', marginLeft: '4px', color: phase.accentColor, fontWeight: 700 }}>✓</span>
                    </div>
                  )}
                </div>

                <div style={{
                  background: phase.accentColor,
                  borderRadius: '14px',
                  padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 16px)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  fontWeight: 700,
                  boxShadow: `0 3px 10px ${phase.accentColor}60`,
                  whiteSpace: 'nowrap',
                }}>
                  {allDone ? '↺' : '▶ Play'}
                </div>
              </motion.button>
            );
          }

          // Locked phase — compact
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              style={{
                width: '100%',
                background: 'rgba(200, 195, 205, 0.35)',
                border: '1.5px solid rgba(180, 175, 185, 0.4)',
                borderRadius: '12px',
                padding: 'clamp(8px, 1.8vh, 10px) clamp(12px, 3vw, 16px)',
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(8px, 2.5vw, 12px)',
                opacity: 0.6,
              }}
            >
              <span style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>🔒</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: '#999',
                  fontWeight: 600,
                }}>
                  {phase.timeGreek} · {phase.timeLabel}
                </div>
                <div style={{
                  fontSize: 'clamp(10px, 2.5vw, 12px)',
                  color: '#bbb',
                  fontFamily: 'var(--font-body)',
                }}>
                  {phase.activityName}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
