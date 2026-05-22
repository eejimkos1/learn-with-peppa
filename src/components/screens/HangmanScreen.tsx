import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { WORLDS } from '../../data/worlds';
import { speakWord } from '../../utils/synthAudio';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MAX_WRONG = 6;

function getWordList(worldId: string, level: number): string[] {
  const world = WORLDS.find(w => w.id === worldId);
  if (!world) return ['CAT', 'DOG', 'SUN'];

  const words = world.vocabulary
    .map(v => v.english.toUpperCase())
    .filter(w => !w.includes(' '));

  const sorted = words.sort((a, b) => a.length - b.length);

  // Level 6 = easy (short words), Level 7 = harder (longer words)
  if (level === 6) {
    return sorted.slice(0, Math.ceil(sorted.length / 2));
  }
  return sorted.slice(Math.floor(sorted.length / 3));
}

export function HangmanScreen() {
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong, playLevelComplete } = useAudio();

  const worldId = state.currentWorld!;
  const world = WORLDS.find(w => w.id === worldId)!;

  const wordList = useMemo(
    () => getWordList(worldId, state.currentLevel),
    [worldId, state.currentLevel]
  );

  const [wordIndex, setWordIndex] = useState(0);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [roundsWon, setRoundsWon] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setWordIndex(0);
    setGuessed(new Set());
    setWrongCount(0);
    setRoundsWon(0);
    setRoundsPlayed(0);
    setShowResult(false);
    setGameOver(false);
  }, [worldId, state.currentLevel]);

  const totalRounds = Math.min(wordList.length, 5);
  const currentWord = wordList[wordIndex % wordList.length];
  const wordLetters = currentWord.split('');

  const isWordComplete = wordLetters.every(l => guessed.has(l));
  const isLost = wrongCount >= MAX_WRONG;

  const handleGuess = useCallback((letter: string) => {
    if (guessed.has(letter) || isWordComplete || isLost || showResult) return;

    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);

    if (currentWord.includes(letter)) {
      playCorrect();
      const complete = wordLetters.every(l => newGuessed.has(l));
      if (complete) {
        speakWord(currentWord.toLowerCase());
        setRoundsWon(r => r + 1);
        setShowResult(true);
      }
    } else {
      playWrong();
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      if (newWrong >= MAX_WRONG) {
        setShowResult(true);
      }
    }
  }, [guessed, currentWord, wordLetters, wrongCount, isWordComplete, isLost, showResult, playCorrect, playWrong]);

  const handleNextWord = useCallback(() => {
    const nextRound = roundsPlayed + 1;
    setRoundsPlayed(nextRound);

    if (nextRound >= totalRounds) {
      setGameOver(true);
      playLevelComplete();
      return;
    }

    setWordIndex(i => i + 1);
    setGuessed(new Set());
    setWrongCount(0);
    setShowResult(false);
  }, [roundsPlayed, totalRounds, playLevelComplete]);

  const handleFinish = useCallback(() => {
    const stars = roundsWon >= totalRounds ? 3
      : roundsWon >= Math.ceil(totalRounds * 0.6) ? 2
      : roundsWon >= 1 ? 1 : 0;
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId,
        levelIndex: state.currentLevel,
        stars,
        correct: roundsWon,
        total: totalRounds,
        time: 0,
      },
    });
  }, [roundsWon, totalRounds, worldId, state.currentLevel, dispatch]);

  const peppaDecorations = ['🌸', '⭐', '💖', '🦋', '✨', '🌺'];
  const visibleDecorations = peppaDecorations.slice(0, MAX_WRONG - wrongCount);

  const greekWord = world.vocabulary.find(
    v => v.english.toUpperCase() === currentWord
  )?.greek;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #E8F5E9 0%, #C8E6C9 40%, #A5D6A7 80%, #81C784 100%)',
    }}>
      <FloatingElements elements={['🔤', '✨', '🌟', '📝', '💫', '🎀']} count={10} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '100%', padding: '14px 20px 10px',
          background: 'linear-gradient(135deg, rgba(76,175,80,0.9), rgba(56,142,60,0.9))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(76,175,80,0.3)', zIndex: 2,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
          style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', color: 'white',
          }}
        >
          ←
        </motion.button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'white', fontWeight: 800 }}>
            🔤 Hangman / Κρεμάλα
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)' }}>
            Round {Math.min(roundsPlayed + 1, totalRounds)} / {totalRounds}
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.3)', borderRadius: '12px',
          padding: '4px 10px', fontSize: '13px', color: 'white', fontWeight: 700,
        }}>
          ✓ {roundsWon}
        </div>
      </motion.div>

      {/* Game area */}
      <div style={{
        flex: 1, width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '16px', overflowY: 'auto', zIndex: 1, gap: '12px',
      }}>

        {/* Peppa with decorations (lives indicator) */}
        {!gameOver && (
          <motion.div
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <PeppaCharacter
              mood={isLost ? 'idle' : isWordComplete ? 'excited' : wrongCount > 3 ? 'encouraging' : 'happy'}
              size="medium"
              equippedItems={state.progress.equippedItems}
            />
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              {peppaDecorations.map((dec, i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: i < visibleDecorations.length ? 1 : 0.15, scale: i < visibleDecorations.length ? 1 : 0.6 }}
                  style={{ fontSize: '16px' }}
                >
                  {dec}
                </motion.span>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#388E3C', fontFamily: 'var(--font-body)', marginTop: '2px' }}>
              {MAX_WRONG - wrongCount} tries left
            </div>
          </motion.div>
        )}

        {/* Word blanks */}
        {!gameOver && (
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap',
              padding: '12px 16px', background: 'rgba(255,255,255,0.8)',
              borderRadius: '20px', border: '3px solid rgba(76,175,80,0.4)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            {wordLetters.map((letter, i) => {
              const revealed = guessed.has(letter) || showResult;
              return (
                <motion.div
                  key={i}
                  animate={revealed ? { scale: [1, 1.2, 1] } : {}}
                  style={{
                    width: '36px', height: '44px',
                    borderBottom: '3px solid #388E3C',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 800,
                    color: revealed ? (guessed.has(letter) ? '#2E7D32' : '#D32F2F') : 'transparent',
                  }}
                >
                  {revealed ? letter : '_'}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Greek hint */}
        {!gameOver && greekWord && (
          <div style={{
            fontSize: '13px', color: '#666', fontFamily: 'var(--font-body)',
            background: 'rgba(255,255,255,0.6)', borderRadius: '12px', padding: '4px 14px',
          }}>
            💡 {greekWord}
          </div>
        )}

        {/* Round result */}
        <AnimatePresence>
          {showResult && !gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: isWordComplete
                  ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                  : 'linear-gradient(135deg, #FF8A80, #FF5252)',
                borderRadius: '20px', padding: '16px 24px', textAlign: 'center',
                color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {isWordComplete ? '🎉' : '😊'}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700 }}>
                {isWordComplete ? 'Correct! Σωστά!' : `The word was: ${currentWord}`}
              </div>
              <div style={{ marginTop: '10px' }}>
                <Button onClick={handleNextWord} variant="primary" size="medium">
                  {roundsPlayed + 1 >= totalRounds ? 'See Results ➡️' : 'Next Word ➡️'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
                borderRadius: '24px', padding: '24px', textAlign: 'center',
                color: 'white', boxShadow: '0 8px 30px rgba(255,215,0,0.5)',
                width: '100%', maxWidth: '320px',
              }}
            >
              <PeppaCharacter mood="excited" size="medium" equippedItems={state.progress.equippedItems} />
              <div style={{ fontSize: '32px', margin: '8px 0' }}>
                {roundsWon >= totalRounds ? '🌟🌟🌟' : roundsWon >= Math.ceil(totalRounds * 0.6) ? '🌟🌟' : '🌟'}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800 }}>
                {roundsWon >= totalRounds ? 'PERFECT! ΤΕΛΕΙΑ!' : 'Μπράβο! Good job!'}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>
                {roundsWon} / {totalRounds} words correct
              </div>
              <div style={{ marginTop: '16px' }}>
                <Button onClick={handleFinish} variant="gold" size="large">
                  Continue ➡️
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard */}
        {!gameOver && !showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px',
              justifyContent: 'center', maxWidth: '360px',
              padding: '8px', background: 'rgba(255,255,255,0.6)',
              borderRadius: '20px', border: '2px solid rgba(76,175,80,0.3)',
            }}
          >
            {ALPHABET.map(letter => {
              const used = guessed.has(letter);
              const isInWord = currentWord.includes(letter);
              return (
                <motion.button
                  key={letter}
                  whileHover={!used ? { scale: 1.1 } : {}}
                  whileTap={!used ? { scale: 0.9 } : {}}
                  onClick={() => handleGuess(letter)}
                  disabled={used}
                  style={{
                    width: '36px', height: '40px',
                    borderRadius: '10px',
                    border: 'none',
                    background: used
                      ? isInWord
                        ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
                        : 'rgba(200,200,200,0.5)'
                      : 'linear-gradient(135deg, #fff, #f0f0f0)',
                    color: used ? (isInWord ? 'white' : '#999') : '#333',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px', fontWeight: 700,
                    cursor: used ? 'default' : 'pointer',
                    boxShadow: used ? 'none' : '0 2px 6px rgba(0,0,0,0.1)',
                    opacity: used && !isInWord ? 0.5 : 1,
                  }}
                >
                  {letter}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
