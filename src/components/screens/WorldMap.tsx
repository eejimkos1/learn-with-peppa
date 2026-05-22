import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { WORLDS } from '../../data/worlds';
import { WorldId } from '../../types';

// Rainbow path segment colors
const RAINBOW_COLORS = ['#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF', '#FF6BCD'];

function ProgressRing({
  earned,
  max,
  color,
  size = 80,
}: {
  earned: number;
  max: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(earned / max, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={6}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

export function WorldMap() {
  const { state, dispatch } = useGame();
  const { progress } = state;

  // Count stars earned in a world (max 21 = 7 levels × 3 stars)
  function worldStarsEarned(worldId: WorldId): number {
    let total = 0;
    for (let lvl = 0; lvl < 7; lvl++) {
      const key = `${worldId}-${lvl}`;
      total += progress.levelResults[key]?.stars ?? 0;
    }
    return total;
  }

  function isUnlocked(worldId: WorldId): boolean {
    return progress.unlockedWorlds.includes(worldId);
  }

  // The "current" world: last unlocked one that isn't fully completed, or the highest unlocked
  function isCurrentWorld(worldId: WorldId): boolean {
    const unlockedList = WORLDS.filter((w) => isUnlocked(w.id));
    if (unlockedList.length === 0) return false;
    const last = unlockedList[unlockedList.length - 1];
    return last.id === worldId;
  }

  function handleWorldClick(worldId: WorldId) {
    if (!isUnlocked(worldId)) return;
    dispatch({ type: 'SELECT_WORLD', worldId });
    // SELECT_WORLD already sets screen to 'daySchedule' in reducer
  }

  function handleBack() {
    dispatch({ type: 'SET_SCREEN', screen: 'home' });
  }

  // Cloud positions for background decoration
  const clouds = [
    { top: '8%', left: '5%', size: 60, opacity: 0.7 },
    { top: '12%', left: '55%', size: 80, opacity: 0.55 },
    { top: '28%', left: '70%', size: 50, opacity: 0.6 },
    { top: '42%', left: '2%', size: 70, opacity: 0.65 },
    { top: '58%', left: '60%', size: 55, opacity: 0.5 },
    { top: '72%', left: '15%', size: 65, opacity: 0.6 },
    { top: '85%', left: '50%', size: 75, opacity: 0.55 },
  ];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #87CEEB 0%, #B0E0FF 35%, #D4F1FF 60%, #E8F9FF 80%, #F0FFF4 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sky clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 6 + i * 1.3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: c.top,
            left: c.left,
            width: `${c.size}px`,
            height: `${c.size * 0.6}px`,
            background: 'white',
            borderRadius: '50px',
            opacity: c.opacity,
            zIndex: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        />
      ))}

      {/* TOP BAR */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 12px',
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(255,182,193,0.4)',
        }}
      >
        <motion.button
          onClick={handleBack}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            width: '42px',
            height: '42px',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'white',
            boxShadow: '0 3px 12px rgba(233,30,99,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </motion.button>

        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '20px',
            color: '#E91E63',
            textShadow: '0 1px 4px rgba(233,30,99,0.2)',
            letterSpacing: '0.5px',
          }}
        >
          🗺️ Ο Χάρτης μου
        </div>

        {/* Total stars pill */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            borderRadius: 'var(--radius-lg)',
            padding: '6px 14px',
            fontFamily: 'var(--font-numbers)',
            fontSize: '15px',
            color: 'white',
            fontWeight: 700,
            boxShadow: '0 2px 10px rgba(255,165,0,0.4)',
          }}
        >
          ⭐ {progress.totalStars}
        </div>
      </motion.div>

      {/* SCROLLABLE MAP CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 20px 40px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Rainbow path + world circles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
          }}
        >
          {WORLDS.map((world, index) => {
            const unlocked = isUnlocked(world.id);
            const current = isCurrentWorld(world.id);
            const earned = worldStarsEarned(world.id);
            const maxStars = 21;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={world.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {/* Rainbow connector above (skip for first) */}
                {index > 0 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    style={{
                      width: '12px',
                      height: '40px',
                      background: `linear-gradient(180deg, ${RAINBOW_COLORS[index - 1]}, ${RAINBOW_COLORS[index]})`,
                      borderRadius: '6px',
                      boxShadow: `0 0 10px ${RAINBOW_COLORS[index]}60`,
                      transformOrigin: 'top',
                    }}
                  />
                )}

                {/* World row */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.1, type: 'spring', stiffness: 180 }}
                  style={{
                    display: 'flex',
                    flexDirection: isLeft ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '4px 8px',
                  }}
                >
                  {/* World circle */}
                  <motion.div
                    onClick={() => handleWorldClick(world.id)}
                    whileHover={unlocked ? { scale: 1.07 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    animate={
                      current
                        ? {
                            boxShadow: [
                              `0 0 20px ${world.colors.primary}60`,
                              `0 0 40px ${world.colors.primary}90`,
                              `0 0 20px ${world.colors.primary}60`,
                            ],
                          }
                        : {}
                    }
                    transition={current ? { duration: 2, repeat: Infinity } : {}}
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: unlocked
                        ? `radial-gradient(circle at 35% 35%, ${world.colors.secondary}, ${world.colors.primary})`
                        : 'radial-gradient(circle at 35% 35%, #ccc, #999)',
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      flexShrink: 0,
                      border: `3px solid ${unlocked ? 'rgba(255,255,255,0.7)' : 'rgba(200,200,200,0.5)'}`,
                      boxShadow: unlocked
                        ? `0 6px 20px ${world.colors.primary}50, inset 0 1px 0 rgba(255,255,255,0.4)`
                        : '0 3px 10px rgba(0,0,0,0.15)',
                      filter: unlocked ? 'none' : 'grayscale(0.7) brightness(0.8)',
                      transition: 'filter 0.2s',
                    }}
                  >
                    <ProgressRing earned={earned} max={maxStars} color={unlocked ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)'} size={80} />

                    {/* World icon */}
                    <span style={{ position: 'relative', zIndex: 2, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {world.icon}
                    </span>

                    {/* Peppa indicator for current world */}
                    {current && (
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                          position: 'absolute',
                          top: '-22px',
                          right: '-10px',
                          fontSize: '18px',
                          zIndex: 5,
                          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                        }}
                      >
                        🐷
                      </motion.div>
                    )}

                    {/* Padlock for locked worlds */}
                    {!unlocked && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          background: 'rgba(150,120,180,0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          zIndex: 3,
                        }}
                      >
                        🔒
                      </div>
                    )}
                  </motion.div>

                  {/* World info card */}
                  <motion.div
                    style={{
                      flex: 1,
                      background: unlocked
                        ? 'rgba(255,255,255,0.8)'
                        : 'rgba(220,210,230,0.6)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 14px',
                      boxShadow: '0 3px 14px rgba(0,0,0,0.1)',
                      border: `2px solid ${unlocked ? 'rgba(255,182,193,0.6)' : 'rgba(200,190,210,0.5)'}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '16px',
                        color: unlocked ? world.colors.primary : '#999',
                        marginBottom: '3px',
                        fontWeight: 700,
                      }}
                    >
                      {world.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: unlocked ? '#666' : '#bbb',
                        marginBottom: '5px',
                      }}
                    >
                      {world.nameEn}
                    </div>

                    {/* Stars or lock requirement */}
                    {unlocked ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-numbers)',
                          fontSize: '13px',
                          color: '#FF8C00',
                        }}
                      >
                        {'⭐'.repeat(Math.min(earned, 7))}
                        <span style={{ color: '#aaa', marginLeft: '4px' }}>
                          {earned}/{maxStars}
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '12px',
                          color: '#CE93D8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>⭐</span>
                        <span>Χρειάζεσαι {world.starsRequired} αστέρια</span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            );
          })}

          {/* End of map decoration */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '24px',
              color: '#E91E63',
            }}
          >
            🎀 ✨ 🎀
          </motion.div>
        </div>
      </div>
    </div>
  );
}
