import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { WORLDS } from '../../data/worlds';
import { speakWord } from '../../utils/synthAudio';
import { Button } from '../common/Button';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { SpeechBubble } from '../common/SpeechBubble';

type Phase = 'learning' | 'review';

interface ReviewQuestion {
  targetWord: string;
  targetPicture: string;
  options: { word: string; picture: string }[];
  correctIndex: number;
}

// Shuffle an array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ShowAndTell() {
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong, playLevelComplete, playStar } = useAudio();

  const world = WORLDS.find(w => w.id === state.currentWorld);
  // level 0 or 1 within ShowAndTell maps to words 0-4 or 5-9
  const startIdx = (state.currentLevel % 2) * 5;
  const words = useMemo(
    () => (world ? world.vocabulary.slice(startIdx, startIdx + 5) : []),
    [world, startIdx]
  );

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('learning');
  const [peppaHappy, setPeppaHappy] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<ReviewQuestion[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewScore, setReviewScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    setCurrentWordIndex(0);
    setPhase('learning');
    setPeppaHappy(false);
    setReviewQuestions([]);
    setReviewIndex(0);
    setReviewScore(0);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  }, [startIdx, state.currentWorld]);

  if (!world || words.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const currentWord = words[currentWordIndex] ?? words[0];
  const showGreek = world.showGreek;
  const primaryColor = world.colors.primary;

  // --- Learning phase helpers ---

  function handleSpeak() {
    speakWord(currentWord.english);
  }

  function handleISaidIt() {
    setPeppaHappy(true);
    playStar();
    setTimeout(() => {
      setPeppaHappy(false);
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(i => i + 1);
      } else {
        // Build review questions
        const questions = buildReviewQuestions();
        setReviewQuestions(questions);
        setReviewIndex(0);
        setReviewScore(0);
        setPhase('review');
      }
    }, 700);
  }

  function buildReviewQuestions(): ReviewQuestion[] {
    const qs: ReviewQuestion[] = [];
    // Pick 3 random words for the mini-review
    const shuffled = shuffle(words).slice(0, 3);
    for (const target of shuffled) {
      // Pick 2 distractors (other words from the set)
      const distractors = shuffle(words.filter(w => w.english !== target.english)).slice(0, 2);
      const optionPool = shuffle([target, ...distractors]);
      const correctIndex = optionPool.findIndex(o => o.english === target.english);
      qs.push({
        targetWord: target.english,
        targetPicture: target.picture,
        options: optionPool.map(o => ({ word: o.english, picture: o.picture })),
        correctIndex,
      });
    }
    return qs;
  }

  // --- Review phase helpers ---

  function handleReviewAnswer(index: number) {
    if (answerFeedback !== null) return; // already answered
    const correct = index === reviewQuestions[reviewIndex].correctIndex;
    setSelectedAnswer(index);
    setAnswerFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      playCorrect();
      setReviewScore(s => s + 1);
    } else {
      playWrong();
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setAnswerFeedback(null);
      if (reviewIndex < reviewQuestions.length - 1) {
        setReviewIndex(i => i + 1);
      } else {
        // Finish
        const finalScore = reviewScore + (correct ? 1 : 0);
        finishLevel(finalScore);
      }
    }, 1000);
  }

  function finishLevel(score: number) {
    const stars = score >= 3 ? 3 : score >= 2 ? 2 : 1;
    playLevelComplete();
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: world!.id,
        levelIndex: state.currentLevel,
        stars,
        correct: score,
        total: 3,
        time: 0,
      },
    });
  }

  // =====================
  // LEARNING PHASE RENDER
  // =====================
  if (phase === 'learning') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: world.colors.background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <FloatingElements elements={world.floatingElements} count={10} />

        {/* Header */}
        <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', zIndex: 1 }}>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '2px solid #FFB6C1',
              borderRadius: '50%',
              width: '40px', height: '40px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ←
          </button>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: primaryColor, fontWeight: 700 }}>
            📖 Show & Tell
          </div>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {words.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: i <= currentWordIndex ? primaryColor : 'rgba(255,255,255,0.5)',
                  border: `2px solid ${primaryColor}`,
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Peppa + speech bubble */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '12px', zIndex: 1 }}>
          <PeppaCharacter mood={peppaHappy ? 'happy' : 'teaching'} size="medium" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWordIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SpeechBubble
                text={peppaHappy ? 'Μπράβο! ⭐' : `Πες μαζί μου: "${currentWord.english}"!`}
                position="left"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Word card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: '28px',
              padding: '28px 32px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(233, 30, 99, 0.18)',
              border: '3px solid #FFB6C1',
              maxWidth: '320px',
              width: '100%',
              zIndex: 1,
              position: 'relative',
            }}
          >
            {/* Decorative sparkles */}
            <span style={{ position: 'absolute', top: '10px', left: '16px', fontSize: '16px', opacity: 0.5 }}>✨</span>
            <span style={{ position: 'absolute', top: '10px', right: '16px', fontSize: '16px', opacity: 0.5 }}>✨</span>

            {/* Picture / Emoji */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '80px', lineHeight: 1, marginBottom: '12px' }}
            >
              {currentWord.picture}
            </motion.div>

            {/* English word */}
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                color: '#E91E63',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '6px',
                textShadow: '0 2px 8px rgba(233, 30, 99, 0.15)',
              }}
            >
              {currentWord.english}
            </div>

            {/* Greek translation (conditional) */}
            {showGreek === 'full' && (
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '22px',
                  color: '#9C27B0',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                {currentWord.greek}
              </div>
            )}
            {showGreek === 'reduced' && (
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  color: '#9C27B0',
                  opacity: 0.6,
                  marginBottom: '8px',
                }}
              >
                {currentWord.greek}
              </div>
            )}

            {/* Audio button */}
            <motion.button
              onClick={handleSpeak}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
                border: 'none',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                fontSize: '26px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(233,30,99,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              🔊
            </motion.button>

            {/* Word index indicator */}
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: '#bbb',
                marginBottom: '16px',
              }}
            >
              {currentWordIndex + 1} / {words.length}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* "I said it!" button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '20px', zIndex: 1 }}
        >
          <Button onClick={handleISaidIt} variant="gold" size="large">
            I said it! ⭐
          </Button>
        </motion.div>

        {/* Pink heart accents */}
        <div style={{ position: 'absolute', bottom: '20px', left: '16px', fontSize: '24px', opacity: 0.3, zIndex: 0 }}>💗</div>
        <div style={{ position: 'absolute', bottom: '40px', right: '20px', fontSize: '18px', opacity: 0.3, zIndex: 0 }}>💕</div>
      </div>
    );
  }

  // ====================
  // REVIEW PHASE RENDER
  // ====================
  const currentQ = reviewQuestions[reviewIndex];
  if (!currentQ) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: world.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingElements elements={['⭐', '💖', '✨', '🌸', '💫']} count={8} />

      {/* Review header */}
      <div
        style={{
          width: '100%', maxWidth: '480px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '16px', zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)', fontSize: '20px',
            color: primaryColor, fontWeight: 700,
          }}
        >
          ⭐ Quick Review!
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '20px',
            padding: '4px 12px',
            fontFamily: 'var(--font-heading)',
            fontSize: '14px',
            color: '#E91E63',
            border: '2px solid #FFB6C1',
          }}
        >
          {reviewIndex + 1} / {reviewQuestions.length}
        </div>
      </div>

      {/* Peppa + speech bubble */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px', zIndex: 1 }}>
        <PeppaCharacter
          mood={answerFeedback === 'correct' ? 'excited' : answerFeedback === 'wrong' ? 'encouraging' : 'teaching'}
          size="medium"
        />
        <SpeechBubble
          text={
            answerFeedback === 'correct'
              ? 'Σωστά! Μπράβο! 🌟'
              : answerFeedback === 'wrong'
              ? 'Μην ανησυχείς! 💕'
              : `Which picture is "${currentQ.targetWord}"?`
          }
          position="left"
        />
      </div>

      {/* Question prompt */}
      <AnimatePresence mode="wait">
        <motion.div
          key={reviewIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '24px',
            padding: '20px 24px',
            textAlign: 'center',
            boxShadow: '0 6px 24px rgba(233,30,99,0.15)',
            border: '3px solid #FFB6C1',
            maxWidth: '380px',
            width: '100%',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '22px',
              color: '#E91E63',
              marginBottom: '20px',
              fontWeight: 700,
            }}
          >
            Which picture is
            <span
              style={{
                display: 'inline-block',
                marginLeft: '8px',
                background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '26px',
              }}
            >
              "{currentQ.targetWord}"
            </span>
            ?
          </div>

          {/* Options */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctIndex;
              const bgColor =
                answerFeedback === null
                  ? 'rgba(255,255,255,0.9)'
                  : isCorrect
                  ? 'rgba(76,175,80,0.25)'
                  : isSelected
                  ? 'rgba(244,67,54,0.2)'
                  : 'rgba(255,255,255,0.9)';
              const borderColor =
                answerFeedback === null
                  ? '#FFB6C1'
                  : isCorrect
                  ? '#4CAF50'
                  : isSelected
                  ? '#F44336'
                  : '#FFB6C1';

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleReviewAnswer(idx)}
                  whileHover={answerFeedback === null ? { scale: 1.08 } : {}}
                  whileTap={answerFeedback === null ? { scale: 0.92 } : {}}
                  style={{
                    width: '90px', height: '90px',
                    background: bgColor,
                    border: `3px solid ${borderColor}`,
                    borderRadius: '20px',
                    fontSize: '44px',
                    cursor: answerFeedback === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(233,30,99,0.1)',
                    transition: 'background 0.3s, border-color 0.3s',
                  }}
                >
                  {option.picture}
                  {answerFeedback !== null && isCorrect && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', fontSize: '18px' }}>✅</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Score stars so far */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '18px' }}>
            {Array.from({ length: reviewQuestions.length }).map((_, i) => (
              <span key={i} style={{ fontSize: '20px', opacity: i < reviewScore ? 1 : 0.25 }}>⭐</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Decorative accents */}
      <div style={{ position: 'absolute', bottom: '20px', left: '16px', fontSize: '24px', opacity: 0.25, zIndex: 0 }}>💗</div>
      <div style={{ position: 'absolute', bottom: '48px', right: '20px', fontSize: '18px', opacity: 0.25, zIndex: 0 }}>💕</div>
    </div>
  );
}
