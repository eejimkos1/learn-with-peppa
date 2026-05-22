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
  levels: number[]; // level indices (0-based), e.g. [0,1]
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

// For a level to be available, all prior levels must have at least 1 star
function isLevelAvailable(levelIndex: number, worldId: WorldId, levelResults: Record<string, { stars: number }>): boolean {
  if (levelIndex === 0) return true;
  for (let i = 0; i < levelIndex; i++) {
    const key = `${worldId}-${i}`;
    if (!levelResults[key] || levelResults[key].stars < 1) return false;
  }
  return true;
}

function getLevelStars(levelIndex: number, worldId: WorldId, levelResults: Record<string, { stars: number }>): number {
  const key = `${worldId}-${levelIndex}`;
  return levelResults[key]?.stars ?? 0;
}

function StarRow({ stars, max = 3 }: { stars: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
          style={{
            fontSize: '16px',
            filter: i < stars ? 'none' : 'grayscale(1) opacity(0.3)',
          }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}

export function DaySchedule() {
  const { state, dispatch } = useGame();
  const { currentWorld, progress } = state;

  const worldConfig = WORLDS.find((w) => w.id === currentWorld);

  function handleBack() {
    dispatch({ type: 'SET_SCREEN', screen: 'worldMap' });
  }

  function handleLevelClick(phase: Phase, levelIndex: number) {
    const available = isLevelAvailable(levelIndex, currentWorld as WorldId, progress.levelResults);
    if (!available) return;

    dispatch({ type: 'SELECT_LEVEL', level: levelIndex });
    dispatch({ type: 'SET_SCREEN', screen: phase.screen });
  }

  // Background based on world
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
      {/* Decorative floating elements from the world */}
      {worldConfig && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
          {worldConfig.floatingElements.map((el, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3 + i * 0.7, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: `${10 + i * 16}%`,
                top: `${15 + (i % 3) * 25}%`,
                fontSize: `${14 + (i % 3) * 6}px`,
              }}
            >
              {el}
            </motion.span>
          ))}
        </div>
      )}

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(12px, 3vh, 16px) clamp(14px, 4vw, 20px) clamp(8px, 2vh, 12px)',
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(255,255,255,0.4)',
          flexShrink: 0,
        }}
      >
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            background: `linear-gradient(135deg, ${worldPrimary}, ${worldConfig?.colors.secondary ?? '#FF69B4'})`,
            border: 'none',
            borderRadius: 'var(--radius-md)',
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
              fontSize: 'clamp(18px, 5vw, 22px)',
              color: worldPrimary,
              textShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          >
            {worldConfig ? `${worldConfig.icon} ${worldConfig.name}` : '🗓️ Το Πρόγραμμα'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'rgba(80,40,60,0.7)',
              marginTop: '1px',
            }}
          >
            {worldConfig?.nameEn ?? 'Day Schedule'}
          </div>
        </div>

        {/* World stars */}
        <div
          style={{
            background: 'rgba(255,255,255,0.55)',
            borderRadius: 'var(--radius-lg)',
            padding: '5px 12px',
            fontFamily: 'var(--font-numbers)',
            fontSize: '14px',
            color: '#FF8C00',
            fontWeight: 700,
            boxShadow: '0 2px 8px rgba(255,165,0,0.2)',
            border: '1.5px solid rgba(255,215,0,0.4)',
          }}
        >
          ⭐ {progress.totalStars}
        </div>
      </motion.div>

      {/* PHASES */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'clamp(12px, 3vh, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(8px, 2vh, 12px)',
          zIndex: 5,
          position: 'relative',
        }}
      >
        {/* Title row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(12px, 3.5vw, 15px)',
            color: 'rgba(80,30,60,0.8)',
            marginBottom: '4px',
          }}
        >
          Διάλεξε δραστηριότητα! · Choose an activity!
        </motion.div>

        {PHASES.map((phase, phaseIndex) => {
          // Determine if entire phase block is accessible (first level of phase is available)
          const phaseFirstLevel = phase.levels[0];
          const phaseAvailable = isLevelAvailable(phaseFirstLevel, currentWorld as WorldId, progress.levelResults);

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: phaseIndex % 2 === 0 ? -30 : 30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.4, delay: phaseIndex * 0.1, type: 'spring', stiffness: 200 }}
              style={{
                background: phaseAvailable
                  ? 'rgba(255,255,255,0.88)'
                  : 'rgba(230,220,235,0.65)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: phaseAvailable
                  ? '0 5px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
                border: `2px solid ${phaseAvailable ? phase.accentColor + '55' : 'rgba(200,190,210,0.4)'}`,
                filter: phaseAvailable ? 'none' : 'grayscale(0.3)',
              }}
            >
              {/* Phase header */}
              <div
                style={{
                  background: phaseAvailable ? phase.bgGradient : 'linear-gradient(135deg, #ddd, #ccc)',
                  padding: 'clamp(8px, 2vh, 10px) clamp(12px, 3vw, 16px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(8px, 2.5vw, 10px)',
                }}
              >
                <span style={{ fontSize: 'clamp(20px, 6vw, 26px)' }}>{phase.timeEmoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(13px, 3.5vw, 16px)',
                      color: phaseAvailable ? phase.accentColor : '#aaa',
                      fontWeight: 700,
                    }}
                  >
                    {phase.timeGreek} · {phase.timeLabel}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: phaseAvailable ? 'rgba(80,40,60,0.8)' : '#bbb',
                    }}
                  >
                    {phase.activityGreek}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: phaseAvailable ? 'rgba(80,40,60,0.6)' : '#ccc',
                      fontStyle: 'italic',
                    }}
                  >
                    {phase.activityName}
                  </div>
                </div>
                {!phaseAvailable && (
                  <div style={{ fontSize: '20px' }}>🔒</div>
                )}
              </div>

              {/* Level buttons */}
              <div
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                }}
              >
                {phase.levels.map((levelIndex) => {
                  const available = isLevelAvailable(levelIndex, currentWorld as WorldId, progress.levelResults);
                  const stars = getLevelStars(levelIndex, currentWorld as WorldId, progress.levelResults);
                  const done = stars > 0;

                  return (
                    <motion.button
                      key={levelIndex}
                      onClick={() => handleLevelClick(phase, levelIndex)}
                      whileHover={available ? { scale: 1.05, y: -2 } : {}}
                      whileTap={available ? { scale: 0.95 } : {}}
                      style={{
                        flex: 1,
                        minWidth: '80px',
                        background: available
                          ? done
                            ? `linear-gradient(135deg, ${phase.accentColor}22, ${phase.accentColor}44)`
                            : 'linear-gradient(135deg, #fff, #f8f0ff)'
                          : 'rgba(220,210,225,0.5)',
                        border: `2px solid ${available ? (done ? phase.accentColor + 'aa' : 'rgba(255,182,193,0.7)') : 'rgba(200,190,210,0.4)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: 'clamp(8px, 2vh, 10px) clamp(6px, 2vw, 8px)',
                        cursor: available ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: available
                          ? done
                            ? `0 3px 12px ${phase.accentColor}30`
                            : '0 2px 8px rgba(255,105,180,0.15)'
                          : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Level number */}
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(12px, 3vw, 14px)',
                          color: available ? phase.accentColor : '#bbb',
                          fontWeight: 700,
                        }}
                      >
                        {available ? `Επίπεδο ${levelIndex + 1}` : `🔒 ${levelIndex + 1}`}
                      </div>

                      {/* Status: stars if done, lock if not available, empty stars if available but not done */}
                      {available ? (
                        <StarRow stars={stars} max={3} />
                      ) : (
                        <div style={{ fontSize: '16px' }}>🔒</div>
                      )}

                      {/* Done checkmark */}
                      {done && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          style={{
                            width: '18px',
                            height: '18px',
                            background: phase.accentColor,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            textAlign: 'center',
            padding: '8px',
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            color: 'rgba(233,30,99,0.6)',
          }}
        >
          💖 Καλή επιτυχία, {state.progress.totalStars > 0 ? '⭐ αστεράκι' : 'μικρή μαθήτρια'}! 💖
        </motion.div>
      </div>
    </div>
  );
}
