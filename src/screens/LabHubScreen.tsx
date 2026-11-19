import { useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { LessonCase } from '../types';
import { CORE_MOTTO, HABITS } from '../data';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface LabHubScreenProps {
  lessonCase: LessonCase;
  agentName: string;
  hasCompletedLesson: boolean;
  skipDialogueInitially?: boolean;
  onStartLesson: () => void;
}

export function LabHubScreen({
  lessonCase,
  agentName,
  hasCompletedLesson,
  skipDialogueInitially = false,
  onStartLesson,
}: LabHubScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(
    skipDialogueInitially ? 4 : 1
  );

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-10 space-y-6 animate-fade-up">
      {/* Panda Introduction Dialogue */}
      <div className="cel-card p-6 sm:p-8">
        {step === 1 && (
          <SpeechBubble
            pose="welcome"
            avatarSize="lg"
            onContinue={() => setStep(2)}
            continueLabel="Continue"
          >
            <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
              Welcome to the Lab, {agentName}!
            </p>
          </SpeechBubble>
        )}

        {step === 2 && (
          <SpeechBubble
            pose="explaining"
            avatarSize="lg"
            onContinue={() => setStep(3)}
            continueLabel="Continue"
          >
            <p className="font-display font-semibold text-lg sm:text-xl text-[#072C2F]">
              Here, we explore real customer situations and discover what makes
              support truly great.
            </p>
          </SpeechBubble>
        )}

        {step === 3 && (
          <SpeechBubble
            pose="thinking"
            avatarSize="lg"
            onContinue={() => setStep(4)}
            continueLabel="Continue"
          >
            <p className="font-display font-semibold text-lg sm:text-xl text-[#072C2F]">
              No boring lectures. Just a few challenges, some curious thinking
              and perhaps a little wisdom.
            </p>
          </SpeechBubble>
        )}

        {step === 4 && (
          <SpeechBubble
            pose={hasCompletedLesson ? 'celebrating' : 'encouraging'}
            avatarSize="lg"
          >
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              {hasCompletedLesson
                ? `Welcome back to the Lab, ${agentName}! Want to explore the case again?`
                : 'Ready? I have something interesting waiting for you.'}
            </p>
            <p className="text-sm text-[#64748B]">
              {hasCompletedLesson
                ? 'You have already completed this lesson, and you can replay it anytime to sharpen your habits.'
                : 'Open the lesson below whenever you are ready to begin.'}
            </p>
          </SpeechBubble>
        )}

        {step < 4 && (
          <div className="mt-4 flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#F1ECE1]">
            <span>Step {step} of 4</span>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="font-semibold text-[#0F5C61] hover:underline cursor-pointer"
            >
              Skip intro dialogue
            </button>
          </div>
        )}
      </div>

      {/* Prominent Lesson Card revealed on Step 4 */}
      {step === 4 && (
        <div className="space-y-5 animate-fade-up">
          <div className="cel-card overflow-hidden border-2 border-[#0F5C61]/20">
            <div className="bg-gradient-to-r from-[#072C2F] via-[#0F5C61] to-[#167379] px-6 py-5 sm:px-8 sm:py-6 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#ECFCCB] text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Case Lesson</span>
                  {hasCompletedLesson && (
                    <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-[#84CC16] text-[#072C2F] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                  First Time Resolution
                </h1>
                <p className="text-[#E2F1F1] text-sm sm:text-base mt-1">
                  Understand the whole problem. Not just the question.
                </p>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 text-xs sm:text-sm font-medium text-[#FAF7F2]">
                <Clock className="w-4 h-4 text-[#A3E635]" />
                <span>About 5–7 minutes · Interactive lesson</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                  Four Habits You&apos;ll Practice
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {HABITS.map((habit) => (
                    <div
                      key={habit.id}
                      className="cel-surface-warm p-3.5 flex items-center gap-3"
                    >
                      <HabitIcon habit={habit.id} size={38} />
                      <div>
                        <div className="text-xs font-extrabold text-[#072C2F] tracking-wide">
                          {habit.title}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {habit.shortDesc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#EFE9DC]">
                <div className="text-sm text-[#475569] font-medium">
                  {lessonCase.teaser}
                </div>
                <button
                  type="button"
                  onClick={onStartLesson}
                  className="cel-btn-lime text-base px-6 py-3"
                >
                  {hasCompletedLesson ? 'Replay Lesson' : "Let's do this!"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <WisdomBanner quote={CORE_MOTTO} label="Core CEL Philosophy" />
        </div>
      )}
    </section>
  );
}
