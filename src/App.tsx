import { AnimatePresence, motion } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import { UserProvider, useUser } from './context/UserContext';
import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { WorldMap } from './components/screens/WorldMap';
import { DaySchedule } from './components/screens/DaySchedule';
import { ShowAndTell } from './components/screens/ShowAndTell';
import { PictureExplorer } from './components/screens/PictureExplorer';
import { SingAlong } from './components/screens/SingAlong';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { TrophyScreen } from './components/screens/TrophyScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen';
import { DressUpScreen } from './components/screens/DressUpScreen';
import { ScenePicker } from './components/screens/ScenePicker';
import { HangmanScreen } from './components/screens/HangmanScreen';

function GameRouter() {
  const { state } = useGame();

  const screens: Record<string, JSX.Element> = {
    splash: <SplashScreen />,
    auth: <AuthScreen />,
    home: <HomeScreen />,
    worldMap: <WorldMap />,
    daySchedule: <DaySchedule />,
    showAndTell: <ShowAndTell />,
    pictureExplorer: <PictureExplorer />,
    singAlong: <SingAlong />,
    quiz: <QuizScreen />,
    results: <ResultsScreen />,
    trophy: <TrophyScreen />,
    settings: <SettingsScreen />,
    leaderboard: <LeaderboardScreen />,
    dressUp: <DressUpScreen />,
    scenePicker: <ScenePicker />,
    hangman: <HangmanScreen />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.screen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        style={{ width: '100%', height: '100%' }}
      >
        {screens[state.screen] || <HomeScreen />}
      </motion.div>
    </AnimatePresence>
  );
}

function AppWithContext() {
  const { state } = useGame();
  const { isAuthenticated } = useUser();

  if (state.screen === 'splash') return <SplashScreen />;
  if (!isAuthenticated && state.screen !== 'auth') return <AuthScreen />;
  return <GameRouter />;
}

export default function App() {
  return (
    <UserProvider>
      <GameProvider>
        <AudioProvider>
          <AppWithContext />
        </AudioProvider>
      </GameProvider>
    </UserProvider>
  );
}
