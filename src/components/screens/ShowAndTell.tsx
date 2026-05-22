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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const currentWord = words[currentWordIndex] ?? words[0];
  const showGreek = world.showGreek;
  const primaryColor = world.colors.primary;

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
    const shuffled = shuffle(words).slice(0, 3);
    for (const target of shuffled) {
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

  function handleReviewAnswer(index: number) {
    if (answerFeedback !== null) return;
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

  if (phase === 'learning') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: world.colors.background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 'clamp(12px, 3vh, 20px) clamp(12px, 4vw, 20px)',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        <FloatingElements elements={world.floatingElements} count={5} />

        <div style={{ width: '100%', maxWidth: 'min(480px, 95%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(8px, 2vh, 16px)', zIndex: 1 }}>
          <button
            onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
            style={{
              background: 'rgba(255,255,255,0.6)',
              border: '2px solid #FFB6C1',
              borderRadius: '50%',
              width: 'clamp(32px, 9vw, 40px)', height: 'clamp(32px, 9vw, 40px)',
              fontSize: 'clamp(14px, 4vw, 18px)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ←
          </button>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(14px, 4vw, 18px)', color: primaryColor, fontWeight: 700 }}>
            📖 Show & Tell
          </div>
          <div style={{ display: 'flex', gap: 'clamp(4px, 1.5vw, 6px)' }}>
            {words.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 'clamp(7px, 2vw, 10px)', height: 'clamp(7px, 2vw, 10px)', borderRadius: '50%',
                  background: i <= currentWordIndex ? primaryColor : 'rgba(255,255,255,0.5)',
                  border: `2px solid ${primaryColor}`,
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(8px, 2.5vw, 12px)', marginBottom: 'clamp(8px, 2vh, 12px)', zIndex: 1 }}>
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
              padding: 'clamp(16px, 4vh, 28px) clamp(20px, 6vw, 32px)',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(233, 30, 99, 0.18)',
              border: '3px solid #FFB6C1',
              maxWidth: 'min(320px, 85%)',
              width: '100%',
              zIndex: 1,
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', top: '10px', left: '16px', fontSize: '16px', opacity: 0.5 }}>✨</span>
            <span style={{ position: 'absolute', top: '10px', right: '16px', fontSize: '16px', opacity: 0.5 }}>✨</span>

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 'clamp(50px, 15vw, 80px)', lineHeight: 1, marginBottom: 'clamp(8px, 2vh, 12px)' }}
            >
              {currentWord.picture}
            </motion.div>

            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(24px, 7vw, 36px)',
                color: '#E91E63',
                fontWeight: 700,
                letterSpacing: '1px',
                marginBottom: '6px',
                textShadow: '0 2px 8px rgba(233, 30, 99, 0.15)',
              }}
            >
              {currentWord.english}
            </div>

            {showGreek === 'full' && (
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(16px, 5vw, 22px)',
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
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  color: '#9C27B0',
                  opacity: 0.6,
                  marginBottom: '8px',
                }}
              >
                {currentWord.greek}
              </div>
            )}

            <motion.button
              onClick={handleSpeak}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
                border: 'none',
                borderRadius: '50%',
                width: 'clamp(42px, 12vw, 56px)',
                height: 'clamp(42px, 12vw, 56px)',
                fontSize: 'clamp(20px, 6vw, 26px)',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(233,30,99,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto clamp(8px, 2vh, 16px)',
              }}
            >
              🔊
            </motion.button>

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(10px, 2.8vw, 12px)',
                color: '#bbb',
                marginBottom: 'clamp(8px, 2vh, 16px)',
              }}
            >
              {currentWordIndex + 1} / {words.length}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 'clamp(12px, 3vh, 20px)', zIndex: 1 }}
        >
          <Button onClick={handleISaidIt} variant="gold" size="large">
            I said it! ⭐
          </Button>
        </motion.div>

      </div>
    );
  }

  const currentQ = reviewQuestions[reviewIndex];
  if (!currentQ) return null;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: world.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'clamp(12px, 3vh, 20px) clamp(12px, 4vw, 20px)',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      <FloatingElements elements={['⭐', '💖', '✨', '🌸']} count={5} />

      <div
        style={{
          width: '100%', maxWidth: 'min(480px, 95%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 'clamp(8px, 2vh, 16px)', zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 4.5vw, 20px)',
            color: primaryColor, fontWeight: 700,
          }}
        >
          ⭐ Quick Review!
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '20px',
            padding: 'clamp(3px, 0.8vh, 4px) clamp(8px, 3vw, 12px)',
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(11px, 3vw, 14px)',
            color: '#E91E63',
            border: '2px solid #FFB6C1',
          }}
        >
          {reviewIndex + 1} / {reviewQuestions.length}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(8px, 2.5vw, 12px)', marginBottom: 'clamp(8px, 2vh, 16px)', zIndex: 1 }}>
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

      <AnimatePresence mode="wait">
        <motion.div
          key={reviewIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            background: 'rgba(255,255,255,0.92)',
            borderRadius: '24px',
            padding: 'clamp(12px, 3vh, 20px) clamp(16px, 5vw, 24px)',
            textAlign: 'center',
            boxShadow: '0 6px 24px rgba(233,30,99,0.15)',
            border: '3px solid #FFB6C1',
            maxWidth: 'min(380px, 90%)',
            width: '100%',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(16px, 5vw, 22px)',
              color: '#E91E63',
              marginBottom: 'clamp(12px, 3vh, 20px)',
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
                fontSize: 'clamp(18px, 5.5vw, 26px)',
              }}
            >
              "{currentQ.targetWord}"
            </span>
            ?
          </div>

          <div style={{ display: 'flex', gap: 'clamp(8px, 2.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    width: 'clamp(65px, 20vw, 90px)', height: 'clamp(65px, 20vw, 90px)',
                    background: bgColor,
                    border: `3px solid ${borderColor}`,
                    borderRadius: '20px',
                    fontSize: 'clamp(30px, 10vw, 44px)',
                    cursor: answerFeedback === null ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(233,30,99,0.1)',
                    transition: 'background 0.3s, border-color 0.3s',
                    position: 'relative',
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

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: 'clamp(10px, 2.5vh, 18px)' }}>
            {Array.from({ length: reviewQuestions.length }).map((_, i) => (
              <span key={i} style={{ fontSize: 'clamp(16px, 4.5vw, 20px)', opacity: i < reviewScore ? 1 : 0.25 }}>⭐</span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
