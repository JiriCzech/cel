import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { LessonCase } from '../types';
import { HABITS, LESSON_INFO } from '../data';
import { HabitIcon } from '../components/HabitIcon';
import { PandaAvatar } from '../components/PandaAvatar';

interface CompletionScreenProps {
  lessonCase: LessonCase;
  agentName: string;
  reflectionNote: string;
  onBackToLab: () => void;
  onReplayLesson: () => void;
}

function buildSummaryText(
  lessonCase: LessonCase,
  agentName: string,
  reflectionNote: string
): string {
  const lines = [
    `${LESSON_INFO.title} · Ticket #${lessonCase.ticket.id} (${lessonCase.ticket.customerName} – ${lessonCase.title})`,
    `Agent: ${agentName}`,
    '',
    ...HABITS.map(
      (habit) => `• ${habit.label}: ${lessonCase.reflection.takeaways[habit.id]}`
    ),
    '',
    `Next-ticket commitment: ${reflectionNote || 'No note added.'}`,
  ];
  return lines.join('\n');
}

export function CompletionScreen({
  lessonCase,
  agentName,
  reflectionNote,
  onBackToLab,
  onReplayLesson,
}: CompletionScreenProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const summaryText = buildSummaryText(lessonCase, agentName, reflectionNote);

  const markCopied = () => {
    setCopied(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      markCopied();
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      markCopied();
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      <div className="cel-card overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-[#072C2F] via-[#0F5C61] to-[#167379] px-6 py-5 sm:px-8 sm:py-6 text-white flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16] text-[#072C2F] text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lesson Complete</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              {LESSON_INFO.title}
            </h1>
            <p className="text-[#E2F1F1] text-sm sm:text-base">
              #{lessonCase.ticket.id} · {lessonCase.ticket.customerName}
              <span className="mx-2 text-[#7AB3B7]">·</span>
              {lessonCase.title}
            </p>
          </div>

          <div className="hidden sm:block shrink-0">
            <PandaAvatar pose="celebrating" size="sm" crop="portrait" />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* 2x2 Case Takeaways */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {HABITS.map((habit) => (
              <div
                key={habit.id}
                className="cel-surface-warm p-4 flex items-start gap-3.5"
              >
                <HabitIcon habit={habit.id} size={42} className="shrink-0" />
                <div>
                  <div className="text-xs font-extrabold tracking-wide text-[#072C2F]">
                    {habit.title}
                  </div>
                  <p className="text-sm text-[#334155] leading-snug mt-0.5">
                    {lessonCase.reflection.takeaways[habit.id]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Agent Commitment */}
          <div className="rounded-2xl border border-[#BEE37F] bg-[#F7FEE7] p-4 sm:p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#3F6212] mb-1">
              Next-Ticket Commitment · {agentName}
            </div>
            {reflectionNote ? (
              <p className="text-sm sm:text-base text-[#072C2F] font-medium">
                “{reflectionNote}”
              </p>
            ) : (
              <p className="text-sm text-[#4D7C0F] italic">
                No commitment note added for this run.
              </p>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-[#EFE9DC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleCopySummary}
                className="cel-btn-lime text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy summary
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onReplayLesson}
                className="cel-btn-secondary text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Restart case
              </button>
            </div>

            <button
              type="button"
              onClick={onBackToLab}
              className="cel-btn-primary text-sm"
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
