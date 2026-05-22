import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { SONGS } from '../../data/songs';
import { WORLDS } from '../../data/worlds';
import { speakWord, cancelSpeech } from '../../utils/synthAudio';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

export function SingAlong() {
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong, playLevelComplete } = useAudio();

  const world = WORLDS.find(w => w.id === state.currentWorld)!;
  const song = SONGS.find(s => s.id === world.songId)!;

  // Level 9 = fillBlank, Level 8 = learn
  const initialMode: 'learn' | 'fillBlank' = state.currentLevel === 9 ? 'fillBlank' : 'learn';

  const [mode, setMode] = useState<'learn' | 'fillBlank'>(initialMode);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatPulse, setBeatPulse] = useState(false);
  const [activeBlankIndex, setActiveBlankIndex] = useState(0);
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [wrongFeedback, setWrongFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [peppaKey, setPeppaKey] = useState(0);

  useEffect(() => {
    setMode(initialMode);
    setCurrentLine(0);
    setCurrentWord(0);
    setIsPlaying(false);
    setBeatPulse(false);
    setActiveBlankIndex(0);
    setFilledBlanks({});
    setScore(0);
    setWrongFeedback(false);
    setCompleted(false);
    setPeppaKey(0);
  }, [state.currentWorld, state.currentLevel]);

  const msPerBeat = Math.round(60000 / (song?.bpm ?? 100));

  // Play audio of current blank word when fill-blank mode activates or advances
  useEffect(() => {
    if (mode !== 'fillBlank' || completed) return;
    const blank = song.blanks[activeBlankIndex];
    if (blank) {
      const timer = setTimeout(() => {
        cancelSpeech();
        speakWord(blank.answer);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [mode, activeBlankIndex, completed, song.blanks]);

  // Beat pulse effect
  useEffect(() => {
    if (!isPlaying) return;
    const beatTimer = setInterval(() => {
      setBeatPulse(p => !p);
    }, msPerBeat);
    return () => clearInterval(beatTimer);
  }, [isPlaying, msPerBeat]);

  // Learn mode: auto-advance through lines
  useEffect(() => {
    if (mode !== 'learn' || !isPlaying) return;

    const lineWords = song.lyrics[currentLine]?.split(' ') ?? [];
    const msPerWord = msPerBeat * 2;

    if (currentWord < lineWords.length - 1) {
      const t = setTimeout(() => setCurrentWord(w => w + 1), msPerWord);
      return () => clearTimeout(t);
    } else {
      // End of line
      const t = setTimeout(() => {
        if (currentLine < song.lyrics.length - 1) {
          setCurrentLine(l => l + 1);
          setCurrentWord(0);
        } else {
          // Song done — auto-move to fill-blank after a pause
          setIsPlaying(false);
          const done = setTimeout(() => {
            setMode('fillBlank');
            setCurrentLine(0);
            setCurrentWord(0);
            setActiveBlankIndex(0);
          }, 1500);
          return () => clearTimeout(done);
        }
      }, msPerWord * 1.5);
      return () => clearTimeout(t);
    }
  }, [mode, isPlaying, currentLine, currentWord, song.lyrics, msPerBeat]);

  const handlePlayAgain = useCallback(() => {
    setCurrentLine(0);
    setCurrentWord(0);
    setIsPlaying(true);
    setPeppaKey(k => k + 1);
  }, []);

  const handleStartLearning = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Fill-blank helpers
  const currentBlank = song.blanks[activeBlankIndex];
  const totalBlanks = song.blanks.length;

  const handleBlankAnswer = useCallback((option: string) => {
    if (!currentBlank) return;
    if (option === currentBlank.answer) {
      playCorrect();
      setFilledBlanks(prev => ({
        ...prev,
        [`${currentBlank.lineIndex}-${currentBlank.wordIndex}`]: option,
      }));
      setScore(s => s + 1);
      setPeppaKey(k => k + 1);

      const nextIndex = activeBlankIndex + 1;
      if (nextIndex >= totalBlanks) {
        // All blanks done!
        setTimeout(() => {
          setCompleted(true);
          playLevelComplete();
        }, 800);
      } else {
        setTimeout(() => setActiveBlankIndex(nextIndex), 600);
      }
    } else {
      playWrong();
      setWrongFeedback(true);
      setTimeout(() => setWrongFeedback(false), 1500);
    }
  }, [currentBlank, activeBlankIndex, totalBlanks, playCorrect, playWrong, playLevelComplete]);

  const handleFinish = useCallback(() => {
    const stars = score >= totalBlanks ? 3 : score >= totalBlanks * 0.7 ? 2 : score >= totalBlanks * 0.4 ? 1 : 0;
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: world.id,
        levelIndex: state.currentLevel,
        stars,
        correct: score,
        total: totalBlanks,
        time: 0,
      },
    });
  }, [score, totalBlanks, world.id, state.currentLevel, dispatch]);

  const renderLyricLine = (line: string, lineIdx: number) => {
    const words = line.split(' ');
    return (
      <div key={lineIdx} style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: '6px', marginBottom: 'clamp(6px, 1.5vh, 10px)',
      }}>
        {words.map((word, wIdx) => {
          const blankKey = `${lineIdx}-${wIdx}`;
          const blank = song.blanks.find(b => b.lineIndex === lineIdx && b.wordIndex === wIdx);
          const isFilled = filledBlanks[blankKey];
          const isActiveBlank = currentBlank?.lineIndex === lineIdx && currentBlank?.wordIndex === wIdx;

          if (mode === 'fillBlank' && blank) {
            return (
              <motion.span
                key={wIdx}
                animate={isActiveBlank ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{
                  display: 'inline-block',
                  background: isFilled
                    ? 'linear-gradient(135deg, #FF69B4, #E91E63)'
                    : isActiveBlank
                      ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
                      : 'rgba(255,105,180,0.25)',
                  color: isFilled || isActiveBlank ? 'white' : '#FF69B4',
                  borderRadius: '12px',
                  padding: '2px 10px',
                  fontWeight: 700,
                  fontSize: 'clamp(15px, 4vw, 18px)',
                  minWidth: '60px',
                  textAlign: 'center',
                  border: isActiveBlank ? '2px dashed #FF8C00' : '2px dashed #FF69B4',
                  cursor: 'default',
                  boxShadow: isActiveBlank ? '0 0 12px rgba(255,215,0,0.6)' : 'none',
                }}
              >
                {isFilled ? isFilled : '___'}
              </motion.span>
            );
          }

          // Learn mode word highlighting
          const isHighlighted = mode === 'learn' && lineIdx === currentLine && wIdx === currentWord;

          return (
            <motion.span
              key={wIdx}
              animate={isHighlighted ? { scale: [1, 1.2, 1], y: [0, -4, 0] } : {}}
              transition={{ duration: 0.3 }}
              style={{
                display: 'inline-block',
                fontSize: 'clamp(16px, 4.5vw, 20px)',
                fontWeight: isHighlighted ? 800 : 600,
                color: isHighlighted ? '#FF1493' : lineIdx === currentLine && mode === 'learn' ? '#C2185B' : '#9E9E9E',
                background: isHighlighted ? 'rgba(255,20,147,0.15)' : 'transparent',
                borderRadius: '8px',
                padding: '1px 5px',
                transition: 'color 0.2s',
                textShadow: isHighlighted ? '0 0 8px rgba(255,20,147,0.5)' : 'none',
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #FFF0F5 0%, #FFE4F0 30%, #FFC2D6 60%, #FFD700 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <FloatingElements elements={['🎵', '🎶', '🎤', '🌸', '💖', '🎀', '⭐', '✨']} count={16} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          width: '100%', padding: 'clamp(12px, 3vh, 16px) clamp(14px, 4vw, 20px) clamp(8px, 2vh, 12px)',
          background: 'linear-gradient(135deg, rgba(255,105,180,0.9), rgba(233,30,99,0.9))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(233,30,99,0.3)', zIndex: 2,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
          style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%',
            width: 'clamp(30px, 8vw, 36px)', height: 'clamp(30px, 8vw, 36px)', fontSize: 'clamp(14px, 4vw, 18px)', cursor: 'pointer', color: 'white',
          }}
        >
          ←
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(13px, 3.5vw, 16px)', color: 'white', fontWeight: 800 }}>
            {mode === 'learn' ? '🎵 Sing Along!' : '✏️ Fill in the Blanks!'}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
            {song.title}
          </div>
        </div>
        <div style={{ width: '36px' }} />
      </motion.div>

      {/* Song card */}
      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(10px, 2.5vh, 16px) clamp(14px, 4vw, 20px)', overflowY: 'auto', zIndex: 1 }}>

        {/* Peppa + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(10px, 3vw, 16px)', marginBottom: 'clamp(10px, 2.5vh, 16px)' }}>
          <motion.div key={peppaKey}>
            <PeppaCharacter mood={isPlaying ? 'excited' : completed ? 'excited' : 'happy'} size="medium" />
          </motion.div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(12px, 3vw, 14px)', color: '#E91E63', fontWeight: 800 }}>
              {song.titleGreek}
            </div>
            <div style={{ fontSize: '13px', color: '#9E9E9E' }}>
              {song.title}
            </div>
          </div>
        </div>

        {/* Mode pill */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            background: mode === 'learn'
              ? 'linear-gradient(135deg, #CE93D8, #9C27B0)'
              : 'linear-gradient(135deg, #FFD700, #FF8C00)',
            color: 'white', borderRadius: '20px',
            padding: '4px 16px', fontSize: '13px', fontWeight: 700,
            marginBottom: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}
        >
          {mode === 'learn' ? '🎶 Listen & Follow' : `✏️ Blank ${activeBlankIndex + 1} / ${totalBlanks}`}
        </motion.div>

        {/* Wrong feedback banner */}
        <AnimatePresence>
          {wrongFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'linear-gradient(135deg, #FF8FAB, #FF4081)',
                color: 'white', borderRadius: '16px', padding: '8px 20px',
                fontSize: '15px', fontWeight: 700, marginBottom: '12px',
                boxShadow: '0 4px 15px rgba(255,64,129,0.4)',
              }}
            >
              Hmm, try again! 🤔
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lyrics card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            width: '100%', maxWidth: '480px',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '20px', padding: 'clamp(14px, 3.5vh, 20px) clamp(16px, 5vw, 24px)',
            boxShadow: '0 8px 32px rgba(233,30,99,0.15)',
            border: '3px solid rgba(255,105,180,0.3)',
            backdropFilter: 'blur(8px)',
            marginBottom: '16px',
          }}
        >
          {song.lyrics.map((line, lineIdx) => renderLyricLine(line, lineIdx))}
        </motion.div>

        {/* Options for fill-blank */}
        <AnimatePresence>
          {mode === 'fillBlank' && !completed && currentBlank && (
            <motion.div
              key={activeBlankIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                width: '100%', maxWidth: '480px',
                display: 'flex', flexWrap: 'wrap', gap: '10px',
                justifyContent: 'center', marginBottom: '16px',
              }}
            >
              {currentBlank.options.map((opt, i) => {
                const optColors = [
                  { bg: 'linear-gradient(135deg, #FFB3C6, #FF69B4)', shadow: 'rgba(255,105,180,0.4)' },
                  { bg: 'linear-gradient(135deg, #D8B4FE, #A855F7)', shadow: 'rgba(168,85,247,0.4)' },
                  { bg: 'linear-gradient(135deg, #BAE6FD, #38BDF8)', shadow: 'rgba(56,189,248,0.4)' },
                ];
                const col = optColors[i % optColors.length];
                return (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleBlankAnswer(opt)}
                    style={{
                      padding: 'clamp(8px, 2vh, 12px) clamp(16px, 5vw, 24px)',
                      background: col.bg,
                      border: 'none', borderRadius: '16px',
                      color: 'white', fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: `0 4px 16px ${col.shadow}`,
                      minWidth: '100px',
                    }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed result */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                borderRadius: '24px', padding: '20px 32px',
                textAlign: 'center', color: 'white',
                boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: 'clamp(30px, 10vw, 40px)', marginBottom: '8px' }}>
                {score >= totalBlanks ? '🌟🌟🌟' : score >= Math.ceil(totalBlanks * 0.7) ? '🌟🌟' : '🌟'}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 5vw, 22px)', fontWeight: 800 }}>
                {score >= totalBlanks ? 'PERFECT! ΤΕΛΕΙΑ!' : 'Good job! Μπράβο!'}
              </div>
              <div style={{ fontSize: '15px', opacity: 0.9, marginTop: '4px' }}>
                {score} / {totalBlanks} σωστά!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Beat markers */}
        <div style={{
          display: 'flex', gap: '10px', marginBottom: '16px',
          justifyContent: 'center',
        }}>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={isPlaying ? {
                scale: beatPulse ? (i % 2 === 0 ? 1.4 : 1.1) : 1,
                opacity: beatPulse ? (i % 2 === 0 ? 1 : 0.7) : 0.4,
              } : { scale: 1, opacity: 0.3 }}
              transition={{ duration: 0.1 }}
              style={{
                width: '14px', height: '14px', borderRadius: '50%',
                background: i % 2 === 0
                  ? 'linear-gradient(135deg, #FF69B4, #E91E63)'
                  : 'linear-gradient(135deg, #FFD700, #FF8C00)',
                boxShadow: isPlaying && beatPulse ? '0 0 10px rgba(255,105,180,0.7)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {mode === 'learn' && !isPlaying && (
            <Button onClick={handleStartLearning} variant="primary" size="large">
              ▶ Start 🎵
            </Button>
          )}
          {mode === 'learn' && isPlaying && (
            <Button onClick={handlePlayAgain} variant="secondary" size="medium">
              🔄 Play Again
            </Button>
          )}
          {completed && (
            <Button onClick={handleFinish} variant="gold" size="large">
              Next ➡️
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
