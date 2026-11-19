import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { HABITS } from '../data/caseData';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface CompletionScreenProps {
  agentName: string;
  reflectionNote: string;
  onBackToLab: () => void;
  onReplayLesson: () => void;
}

export function CompletionScreen({
  agentName,
  reflectionNote,
  onBackToLab,
  onReplayLesson,
}: CompletionScreenProps) {
  return (
    <section className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 animate-fade-up">
      <div className="cel-card overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-[#072C2F] via-[#0F5C61] to-[#167379] px-6 py-6 sm:px-8 sm:py-7 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84CC16] text-[#072C2F] text-xs font-extrabold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lesson Complete</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            First Time Resolution – Completed
          </h1>
          <p className="text-[#E2F1F1] text-sm sm:text-base mt-1">
            Well explored, {agentName}. Remember: CEL is not about replying
            faster—it is about thinking better.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <SpeechBubble pose="celebrating" avatarSize="xl" variant="success">
            <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
              Nicely done! You&apos;ve taken your first step towards wiser
              support.
            </p>
            <p className="text-sm sm:text-base text-[#334155]">
              Keep these four habits close whenever a tricky customer ticket
              lands in front of you.
            </p>
          </SpeechBubble>

          {/* 4 Habits visual badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {HABITS.map((habit) => (
              <div
                key={habit.id}
                className="rounded-2xl border border-[#BEE37F] bg-[#F7FEE7] p-4 text-center flex flex-col items-center gap-2"
              >
                <HabitIcon habit={habit.id} size={42} />
                <div className="text-xs font-extrabold text-[#072C2F] tracking-wide flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                  <span>{habit.title}</span>
                </div>
                <div className="text-xs text-[#475569]">{habit.shortDesc}</div>
              </div>
            ))}
          </div>

          {reflectionNote && (
            <div className="cel-surface-warm p-4 sm:p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61] mb-1">
                Your Takeaway Note
              </div>
              <p className="text-sm sm:text-base text-[#1E293B] italic">
                “{reflectionNote}”
              </p>
            </div>
          )}

          <WisdomBanner
            quote="A ticket can be closed in a moment. A problem is solved when the customer knows what to do next."
            label="Final Panda Wisdom"
          />

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFE9DC]">
            <button
              type="button"
              onClick={onReplayLesson}
              className="cel-btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Lesson
            </button>
            <button
              type="button"
              onClick={onBackToLab}
              className="cel-btn-primary text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to the Lab
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
