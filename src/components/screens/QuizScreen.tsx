import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { WORLDS } from '../../data/worlds';
import { speakWord } from '../../utils/synthAudio';
import { Button } from '../common/Button';
import { Hearts } from '../common/Hearts';
import { FloatingElements } from '../common/FloatingElements';
import { PeppaCharacter } from '../common/PeppaCharacter';
import { Confetti } from '../common/Confetti';
import { QuizQuestion } from '../../types';

const QUESTION_TYPES: QuizQuestion['type'][] = ['picture-to-word', 'word-to-picture', 'listen-and-choose'];
const TIMER_SECONDS = 15;

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestions(vocab: { english: string; greek: string; picture: string }[]): QuizQuestion[] {
  const questions: QuizQuestion[] = vocab.map((word, i) => {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length];
    const otherWords = vocab.filter((_, j) => j !== i);
    const wrongPicks = shuffleArray(otherWords).slice(0, 3);

    if (type === 'picture-to-word') {
      const correctAnswer = word.english;
      return {
        type,
        prompt: word.picture,
        correctAnswer,
        options: shuffleArray([correctAnswer, ...wrongPicks.map(w => w.english)]),
        picture: word.picture,
      };
    } else if (type === 'word-to-picture') {
      const correctAnswer = word.picture;
      return {
        type,
        prompt: word.english,
        correctAnswer,
        options: shuffleArray([correctAnswer, ...wrongPicks.map(w => w.picture)]),
      };
    } else {
      // listen-and-choose
      const correctAnswer = word.picture;
      return {
        type,
        prompt: word.english,
        correctAnswer,
        options: shuffleArray([correctAnswer, ...wrongPicks.map(w => w.picture)]),
      };
    }
  });
  return shuffleArray(questions);
}

const ANSWER_COLORS = [
  { bg: 'linear-gradient(135deg, #FFB3C6, #FF69B4)', border: '#FF69B4', shadow: 'rgba(255,105,180,0.5)' },
  { bg: 'linear-gradient(135deg, #D8B4FE, #A855F7)', border: '#A855F7', shadow: 'rgba(168,85,247,0.5)' },
  { bg: 'linear-gradient(135deg, #BAE6FD, #38BDF8)', border: '#38BDF8', shadow: 'rgba(56,189,248,0.5)' },
  { bg: 'linear-gradient(135deg, #BBF7D0, #22C55E)', border: '#22C55E', shadow: 'rgba(34,197,94,0.5)' },
];

export function QuizScreen() {
  const { state, dispatch } = useGame();
  const { playCorrect, playWrong, playLevelComplete } = useAudio();

  const worldIndex = WORLDS.findIndex(w => w.id === state.currentWorld);
  const world = WORLDS[worldIndex];
  const hasTimer = worldIndex >= 3;

  const questions = useMemo(() => generateQuestions(world.vocabulary), [world.vocabulary]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [peppaMood, setPeppaMode] = useState<'happy' | 'excited' | 'encouraging' | 'idle'>('happy');
  const [peppaKey, setPeppaKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timerActive, setTimerActive] = useState(hasTimer);

  useEffect(() => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameOver(false);
    setShowConfetti(false);
    setPeppaMode('happy');
    setPeppaKey(0);
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(hasTimer);
  }, [state.currentWorld, state.currentLevel]);

  // Use a ref to hold current lives to avoid stale closures in timer
  const livesRef = useRef(lives);
  livesRef.current = lives;
  const currentQuestionRef = useRef(currentQuestion);
  currentQuestionRef.current = currentQuestion;

  const q = questions[currentQuestion];

  const advanceQuestion = useCallback(() => {
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPeppaMode('happy');
    const qIdx = currentQuestionRef.current;
    if (qIdx < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      playLevelComplete();
    }
  }, [questions.length, playLevelComplete]);

  // Reset timer on each new question
  useEffect(() => {
    if (!hasTimer) return;
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(true);
  }, [currentQuestion, hasTimer]);

  // Countdown timer
  useEffect(() => {
    if (!hasTimer || !timerActive || answered || gameOver) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setAnswered(true);
      setIsCorrect(false);
      const newLives = livesRef.current - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => setGameOver(true), 1500);
      }
      playWrong();
      setPeppaMode('encouraging');
      setPeppaKey(k => k + 1);
      setTimeout(() => { if (newLives > 0) advanceQuestion(); }, 1600);
      return;
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, timerActive, answered, gameOver, hasTimer, playWrong, advanceQuestion]);

  const handleAnswer = useCallback((option: string) => {
    if (answered) return;
    setTimerActive(false);
    setSelectedAnswer(option);
    setAnswered(true);

    if (option === q.correctAnswer) {
      setIsCorrect(true);
      setScore(s => s + 1);
      setShowConfetti(true);
      setPeppaMode('excited');
      setPeppaKey(k => k + 1);
      playCorrect();
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(advanceQuestion, 1500);
    } else {
      setIsCorrect(false);
      const newLives = livesRef.current - 1;
      setLives(newLives);
      setPeppaMode('encouraging');
      setPeppaKey(k => k + 1);
      playWrong();
      if (newLives <= 0) {
        setTimeout(() => setGameOver(true), 1600);
      } else {
        setTimeout(advanceQuestion, 1500);
      }
    }
  }, [answered, q, playCorrect, playWrong, advanceQuestion]);

  const handleListenAndChoose = useCallback(() => {
    speakWord(q.prompt);
  }, [q.prompt]);

  const handleRetry = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameOver(false);
    setShowConfetti(false);
    setPeppaMode('happy');
    setTimeLeft(TIMER_SECONDS);
    setTimerActive(hasTimer);
  }, [hasTimer]);

  const getStars = (s: number) => {
    if (s >= 9) return 3;
    if (s >= 7) return 2;
    if (s >= 5) return 1;
    return 0;
  };

  const finalScore = score;
  const isFinished = currentQuestion >= questions.length - 1 && answered && !gameOver && isCorrect !== null;

  const handleFinish = useCallback(() => {
    const stars = getStars(finalScore);
    dispatch({
      type: 'COMPLETE_LEVEL',
      result: {
        worldId: world.id,
        levelIndex: state.currentLevel,
        stars,
        correct: finalScore,
        total: questions.length,
        time: 0,
      },
    });
  }, [finalScore, world.id, state.currentLevel, questions.length, dispatch]);

  const getButtonState = (option: string) => {
    if (!answered) return 'idle';
    if (option === q.correctAnswer) return 'correct';
    if (option === selectedAnswer) return 'wrong';
    return 'dimmed';
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #0F0C29 0%, #302B63 40%, #24243e 70%, #1a1040 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      <FloatingElements elements={['🌙', '⭐', '💫', '🌟', '✨', '🦋', '💖']} count={18} />
      <Confetti active={showConfetti} count={40} />

      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          width: '100%', padding: '14px 20px 10px',
          background: 'linear-gradient(135deg, rgba(255,105,180,0.95), rgba(156,39,176,0.95))',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 24px rgba(233,30,99,0.5)', zIndex: 2,
          backdropFilter: 'blur(8px)',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'daySchedule' })}
          style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer', color: 'white',
          }}
        >
          ←
        </motion.button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'white', fontWeight: 800 }}>
            🌙 Bedtime Quiz
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
            {world.name} — Q {Math.min(currentQuestion + 1, questions.length)} / {questions.length}
          </div>
        </div>

        <Hearts lives={lives} />
      </motion.div>

      {/* Progress dots */}
      <div style={{
        display: 'flex', gap: '6px', padding: '10px 0', zIndex: 1,
        flexWrap: 'wrap', justifyContent: 'center', maxWidth: '320px',
      }}>
        {questions.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === currentQuestion ? 1.3 : 1 }}
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: i < currentQuestion
                ? 'linear-gradient(135deg, #FFD700, #FF8C00)'
                : i === currentQuestion
                  ? '#FF69B4'
                  : 'rgba(255,255,255,0.2)',
              boxShadow: i === currentQuestion ? '0 0 8px rgba(255,105,180,0.8)' : 'none',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 20px', overflowY: 'auto', zIndex: 1 }}>

        {/* Timer bar */}
        {hasTimer && !gameOver && !isFinished && (
          <div style={{
            width: '100%', maxWidth: '480px', height: '8px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '4px',
            marginBottom: '12px', overflow: 'hidden',
          }}>
            <motion.div
              key={`timer-${currentQuestion}`}
              initial={{ width: '100%' }}
              animate={{ width: answered ? `${(timeLeft / TIMER_SECONDS) * 100}%` : '0%' }}
              transition={{ duration: TIMER_SECONDS, ease: 'linear' }}
              style={{
                height: '100%', borderRadius: '4px',
                background: timeLeft > 7
                  ? 'linear-gradient(90deg, #4CAF50, #8BC34A)'
                  : timeLeft > 3
                    ? 'linear-gradient(90deg, #FFD700, #FF8C00)'
                    : 'linear-gradient(90deg, #FF4081, #E91E63)',
                boxShadow: '0 0 8px rgba(255,255,255,0.3)',
              }}
            />
          </div>
        )}

        {/* Game Over */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                borderRadius: '28px', padding: '32px 40px', textAlign: 'center',
                border: '2px solid rgba(255,105,180,0.4)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>💪</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#FFD700', fontWeight: 800 }}>
                Try Again!
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginTop: '8px', marginBottom: '24px' }}>
                Ξαναπροσπάθησε! You can do it!
              </div>
              <div style={{ fontSize: '18px', color: '#FFB3C6', marginBottom: '24px' }}>
                Score: {score} / {currentQuestion + 1}
              </div>
              <Button onClick={handleRetry} variant="gold" size="large">
                🔄 Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final result */}
        <AnimatePresence>
          {isFinished && !gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(233,30,99,0.2))',
                borderRadius: '28px', padding: '28px 36px', textAlign: 'center',
                border: '2px solid rgba(255,215,0,0.5)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 40px rgba(255,215,0,0.3)',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>
                {getStars(finalScore) === 3 ? '🌟🌟🌟' : getStars(finalScore) === 2 ? '🌟🌟' : getStars(finalScore) === 1 ? '🌟' : '💪'}
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', color: '#FFD700', fontWeight: 800, marginBottom: '8px' }}>
                {getStars(finalScore) === 3 ? 'PERFECT! ΤΕΛΕΙΑ!' : getStars(finalScore) >= 2 ? 'Very Good! Πολύ Καλά!' : 'Good Try! Μπράβο!'}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>
                {finalScore} / {questions.length} correct!
              </div>
              <Button onClick={handleFinish} variant="gold" size="large">
                See Results ➡️
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question card */}
        {!gameOver && !isFinished && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                width: '100%', maxWidth: '480px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '28px', padding: '24px 20px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
                border: '2px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(12px)',
                marginBottom: '16px',
              }}
            >
              {/* Question prompt */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                {q.type === 'listen-and-choose' ? (
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleListenAndChoose}
                    style={{
                      background: 'linear-gradient(135deg, #FF69B4, #E91E63)',
                      border: 'none', borderRadius: '50%',
                      width: '90px', height: '90px',
                      fontSize: '40px', cursor: 'pointer',
                      boxShadow: '0 6px 24px rgba(233,30,99,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    🔊
                  </motion.button>
                ) : q.type === 'picture-to-word' ? (
                  <div style={{ fontSize: '80px', lineHeight: 1 }}>{q.prompt}</div>
                ) : (
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: '30px', fontWeight: 800,
                    color: 'white', textShadow: '0 2px 12px rgba(255,105,180,0.8)',
                    letterSpacing: '1px',
                  }}>
                    {q.prompt}
                  </div>
                )}

                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
                  {q.type === 'picture-to-word' ? 'What word is this?' :
                   q.type === 'word-to-picture' ? 'Which picture matches?' :
                   'Tap to listen — which picture is it?'}
                </div>
              </div>

              {/* Options grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}>
                {q.options.map((option, i) => {
                  const btnState = getButtonState(option);
                  const col = ANSWER_COLORS[i % ANSWER_COLORS.length];

                  return (
                    <motion.button
                      key={option}
                      whileHover={!answered ? { scale: 1.04, y: -2 } : {}}
                      whileTap={!answered ? { scale: 0.96 } : {}}
                      animate={
                        btnState === 'wrong' ? { x: [-6, 6, -4, 4, 0] } :
                        btnState === 'correct' ? { scale: [1, 1.08, 1] } : {}
                      }
                      transition={{ duration: 0.4 }}
                      onClick={() => handleAnswer(option)}
                      disabled={answered}
                      style={{
                        padding: '14px 8px',
                        background: btnState === 'correct'
                          ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                          : btnState === 'wrong'
                            ? 'linear-gradient(135deg, #FF5252, #D32F2F)'
                            : btnState === 'dimmed'
                              ? 'rgba(255,255,255,0.05)'
                              : col.bg,
                        border: `2px solid ${
                          btnState === 'correct' ? '#81C784' :
                          btnState === 'wrong' ? '#FF5252' :
                          btnState === 'dimmed' ? 'rgba(255,255,255,0.1)' :
                          col.border
                        }`,
                        borderRadius: '18px',
                        color: btnState === 'dimmed' ? 'rgba(255,255,255,0.3)' : 'white',
                        fontFamily: q.type === 'picture-to-word' ? 'var(--font-heading)' : 'var(--font-body)',
                        fontSize: q.type === 'word-to-picture' || q.type === 'listen-and-choose' ? '36px' : '16px',
                        fontWeight: 700,
                        cursor: answered ? 'default' : 'pointer',
                        boxShadow: btnState === 'idle' ? `0 4px 16px ${col.shadow}` :
                                   btnState === 'correct' ? '0 4px 20px rgba(76,175,80,0.6)' :
                                   btnState === 'wrong' ? '0 4px 20px rgba(255,82,82,0.6)' : 'none',
                        transition: 'background 0.2s, border-color 0.2s',
                        minHeight: '64px',
                      }}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Peppa + feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <motion.div key={peppaKey}>
            <PeppaCharacter mood={peppaMood} size="small" />
          </motion.div>
          <AnimatePresence>
            {answered && isCorrect !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: isCorrect
                    ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                    : 'linear-gradient(135deg, #FF8FAB, #E91E63)',
                  color: 'white', borderRadius: '16px', padding: '8px 20px',
                  fontSize: '15px', fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                {isCorrect ? '🌟 Correct! Μπράβο!' : '💪 Hmm, try again next time!'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
