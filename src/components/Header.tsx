import { useState } from 'react';
import { Check, Pencil, RotateCcw, Sparkles } from 'lucide-react';
import type { ScreenId } from '../types';

interface HeaderProps {
  agentName: string;
  currentScreen: ScreenId;
  highestReachedStep: number;
  onNavigateScreen: (screen: ScreenId) => void;
  onUpdateName: (newName: string) => void;
  onResetDemo: () => void;
}

interface StepItem {
  id: ScreenId;
  label: string;
  stepIndex: number;
}

const LESSON_STEPS: StepItem[] = [
  { id: 'lesson-intro', label: 'Intro', stepIndex: 1 },
  { id: 'game-1', label: '1. Understand', stepIndex: 2 },
  { id: 'game-2', label: '2. Investigate', stepIndex: 3 },
  { id: 'game-3', label: '3. Ownership', stepIndex: 4 },
  { id: 'game-4', label: '4. Think Ahead', stepIndex: 5 },
  { id: 'reflection', label: 'Reflection', stepIndex: 6 },
];

export function Header({
  agentName,
  currentScreen,
  highestReachedStep,
  onNavigateScreen,
  onUpdateName,
  onResetDemo,
}: HeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(agentName);

  const isInsideLesson =
    currentScreen !== 'meet-panda' && currentScreen !== 'lab-hub';

  const currentStepIdx =
    currentScreen === 'completion'
      ? 7
      : LESSON_STEPS.find((s) => s.id === currentScreen)?.stepIndex ?? 0;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draftName.trim();
    if (trimmed) {
      onUpdateName(trimmed);
      setIsEditingName(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E7DFD0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <button
          type="button"
          onClick={() =>
            onNavigateScreen(agentName ? 'lab-hub' : 'meet-panda')
          }
          className="flex items-center gap-2.5 text-left group cursor-pointer"
          title="Return to Welcome to the Lab"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0F5C61] text-[#FAF7F2] flex items-center justify-center font-display font-extrabold text-sm shadow-sm group-hover:bg-[#0B474B] transition-colors">
            CEL
          </div>
          <div>
            <div className="font-display font-bold text-sm sm:text-base text-[#072C2F] leading-tight">
              Customer Excellence Lab
            </div>
            <div className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
              <span>Webnode Care</span>
              <span className="w-1 h-1 rounded-full bg-[#84CC16]" />
              <span>Agent Panda Edition</span>
            </div>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {agentName && !isEditingName && (
            <button
              type="button"
              onClick={() => {
                setDraftName(agentName);
                setIsEditingName(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5DEC9] text-xs font-semibold text-[#0F5C61] hover:border-[#0F5C61] transition-colors cursor-pointer"
              title="Change your agent name"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>{agentName}</span>
              <Pencil className="w-3 h-3 opacity-60" />
            </button>
          )}

          {isEditingName && (
            <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Your name…"
                aria-label="Edit agent name"
                className="w-32 sm:w-40 px-2.5 py-1 text-xs rounded-lg border border-[#0F5C61] bg-white focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-[#0F5C61] text-white text-xs font-semibold cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-2 py-1 rounded-lg text-xs text-[#64748B] hover:text-[#1E293B] cursor-pointer"
              >
                Cancel
              </button>
            </form>
          )}

          {agentName && (
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#072C2F] hover:bg-[#EFE9DC] transition-colors cursor-pointer"
              title="Restart the entire demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          )}
        </div>
      </div>

      {/* Lesson Stepper */}
      {isInsideLesson && (
        <div className="border-t border-[#ECE4D6] bg-[#F6F1E7]/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto">
            {LESSON_STEPS.map((step, idx) => {
              const isCurrent = step.id === currentScreen;
              const isCompleted =
                step.stepIndex < currentStepIdx ||
                currentScreen === 'completion';
              const isUnlocked = step.stepIndex <= highestReachedStep;

              return (
                <div key={step.id} className="flex items-center shrink-0">
                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) onNavigateScreen(step.id);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-[#0F5C61] text-white shadow-xs'
                        : isCompleted
                          ? 'bg-[#ECFCCB] text-[#3F6212] hover:bg-[#D9F99D] cursor-pointer'
                          : isUnlocked
                            ? 'bg-white text-[#475569] hover:bg-[#EFE9DC] cursor-pointer'
                            : 'text-[#94A3B8] cursor-default'
                    }`}
                  >
                    {isCompleted && !isCurrent && (
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    )}
                    <span>{step.label}</span>
                  </button>
                  {idx < LESSON_STEPS.length - 1 && (
                    <span className="mx-1 text-[#CBD5E1] text-xs select-none">
                      /
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
