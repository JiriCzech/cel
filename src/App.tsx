import { useEffect, useState } from 'react';
import type { ScreenId } from './types';
import { ACTIVE_CASE } from './data';
import { Header } from './components/Header';
import { FeedbackWidget } from './components/FeedbackWidget';
import { MeetPandaScreen } from './screens/MeetPandaScreen';
import { LabHubScreen } from './screens/LabHubScreen';
import { LessonIntroScreen } from './screens/LessonIntroScreen';
import { Game1Understand } from './screens/Game1Understand';
import { Game2Investigate } from './screens/Game2Investigate';
import { Game3Ownership } from './screens/Game3Ownership';
import { Game4ThinkAhead } from './screens/Game4ThinkAhead';
import { ReflectionScreen } from './screens/ReflectionScreen';
import { CompletionScreen } from './screens/CompletionScreen';

const STORAGE_NAME_KEY = 'cel_agent_name';
const STORAGE_COMPLETED_KEY = 'cel_ftr_completed';

const STEP_INDEX_MAP: Record<ScreenId, number> = {
  'meet-panda': 0,
  'lab-hub': 0,
  'lesson-intro': 1,
  'game-1': 2,
  'game-2': 3,
  'game-3': 4,
  'game-4': 5,
  reflection: 6,
  completion: 7,
};

function readStorage(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function writeStorage(key: string, value: string): void {
  try {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage unavailability in sandboxed browsers
  }
}

export function App() {
  const [agentName, setAgentName] = useState<string>(() =>
    readStorage(STORAGE_NAME_KEY)
  );
  const [hasCompletedLesson, setHasCompletedLesson] = useState<boolean>(
    () => readStorage(STORAGE_COMPLETED_KEY) === 'true'
  );
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('meet-panda');
  const [highestReachedStep, setHighestReachedStep] = useState<number>(1);
  const [skipHubDialogue, setSkipHubDialogue] = useState<boolean>(false);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [lessonRunId, setLessonRunId] = useState<number>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const navigateTo = (screen: ScreenId) => {
    const step = STEP_INDEX_MAP[screen];
    setHighestReachedStep((prev) => Math.max(prev, step));
    setCurrentScreen(screen);
  };

  const handleSaveName = (newName: string) => {
    setAgentName(newName);
    writeStorage(STORAGE_NAME_KEY, newName);
  };

  const handleCompleteOnboardingName = (newName: string) => {
    handleSaveName(newName);
    setSkipHubDialogue(false);
    navigateTo('lab-hub');
  };

  const handleStartLesson = () => {
    setLessonRunId((prev) => prev + 1);
    setReflectionNote('');
    setHighestReachedStep(1);
    setCurrentScreen('lesson-intro');
  };

  const handleFinishLesson = (note: string) => {
    setReflectionNote(note);
    setHasCompletedLesson(true);
    writeStorage(STORAGE_COMPLETED_KEY, 'true');
    navigateTo('completion');
  };

  const handleBackToLab = () => {
    setSkipHubDialogue(true);
    navigateTo('lab-hub');
  };

  const handleResetDemo = () => {
    writeStorage(STORAGE_NAME_KEY, '');
    writeStorage(STORAGE_COMPLETED_KEY, '');
    setAgentName('');
    setHasCompletedLesson(false);
    setReflectionNote('');
    setHighestReachedStep(1);
    setSkipHubDialogue(false);
    setLessonRunId((prev) => prev + 1);
    setCurrentScreen('meet-panda');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E293B]">
      <Header
        agentName={agentName}
        currentScreen={currentScreen}
        highestReachedStep={highestReachedStep}
        onNavigateScreen={(screen) => {
          if (screen === 'lab-hub') setSkipHubDialogue(true);
          navigateTo(screen);
        }}
        onUpdateName={handleSaveName}
        onResetDemo={handleResetDemo}
      />

      <main className="flex-1 px-4 sm:px-6 pb-14">
        {currentScreen === 'meet-panda' && (
          <MeetPandaScreen
            existingName={agentName}
            onCompleteName={handleCompleteOnboardingName}
            onContinueToLab={() => {
              setSkipHubDialogue(false);
              navigateTo('lab-hub');
            }}
          />
        )}

        {currentScreen === 'lab-hub' && (
          <LabHubScreen
            lessonCase={ACTIVE_CASE}
            agentName={agentName || 'Agent'}
            hasCompletedLesson={hasCompletedLesson}
            skipDialogueInitially={skipHubDialogue}
            onStartLesson={handleStartLesson}
          />
        )}

        {currentScreen === 'lesson-intro' && (
          <LessonIntroScreen
            key={`intro-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            onStartGame1={() => navigateTo('game-1')}
          />
        )}

        {currentScreen === 'game-1' && (
          <Game1Understand
            key={`g1-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            onComplete={() => navigateTo('game-2')}
          />
        )}

        {currentScreen === 'game-2' && (
          <Game2Investigate
            key={`g2-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            onComplete={() => navigateTo('game-3')}
          />
        )}

        {currentScreen === 'game-3' && (
          <Game3Ownership
            key={`g3-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            agentName={agentName || 'Agent'}
            onComplete={() => navigateTo('game-4')}
          />
        )}

        {currentScreen === 'game-4' && (
          <Game4ThinkAhead
            key={`g4-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            agentName={agentName || 'Agent'}
            onComplete={() => navigateTo('reflection')}
          />
        )}

        {currentScreen === 'reflection' && (
          <ReflectionScreen
            key={`ref-${lessonRunId}`}
            lessonCase={ACTIVE_CASE}
            agentName={agentName || 'Agent'}
            initialReflection={reflectionNote}
            onFinishLesson={handleFinishLesson}
          />
        )}

        {currentScreen === 'completion' && (
          <CompletionScreen
            lessonCase={ACTIVE_CASE}
            agentName={agentName || 'Agent'}
            reflectionNote={reflectionNote}
            onBackToLab={handleBackToLab}
            onReplayLesson={handleStartLesson}
          />
        )}
      </main>

      <footer className="border-t border-[#ECE4D6] py-4 px-4 text-center text-xs text-[#64748B]">
        <span>CEL – Customer Excellence Lab · Webnode Care</span>
      </footer>

      <FeedbackWidget
        currentScreen={currentScreen}
        agentName={agentName || 'Tester'}
      />
    </div>
  );
}

export default App;
