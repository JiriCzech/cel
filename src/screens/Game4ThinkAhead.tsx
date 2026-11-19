import { useState } from 'react';
import { Check, CheckCircle2, Send, X, XCircle } from 'lucide-react';
import type { LessonCase } from '../types';
import { HABITS } from '../data';
import { PandaHint } from '../components/PandaHint';
import { EmailPreview } from '../components/EmailPreview';
import {
  buildReplyParagraphs,
  correctReplyTexts,
  thinkAheadParagraph,
} from '../lib/reply';

interface Game4ThinkAheadProps {
  lessonCase: LessonCase;
  agentName: string;
  onComplete: () => void;
}

export function Game4ThinkAhead({
  lessonCase,
  agentName,
  onComplete,
}: Game4ThinkAheadProps) {
  const habit = HABITS[3];
  const { options, prompt } = lessonCase.thinkAhead;
  const requiredCount = options.filter((o) => o.isCorrect).length;

  const [picked, setPicked] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const isDone = picked.length === requiredCount;

  const handleToggle = (id: string) => {
    if (isDone) return;
    const option = options.find((o) => o.id === id);
    if (!option) return;
    if (option.isCorrect) {
      setPicked((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else {
      setRejected((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const extra = thinkAheadParagraph(options, picked);
  const paragraphs = buildReplyParagraphs(
    lessonCase,
    correctReplyTexts(lessonCase),
    extra || undefined
  );

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-5 animate-fade-up">
      <PandaHint
        pose={isDone ? 'encouraging' : 'thinking'}
        tone={isDone ? 'success' : 'default'}
        habit="think-ahead"
        eyebrow={habit.label}
      >
        {isDone ? habit.motto : prompt}
      </PandaHint>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-5 items-start">
        {/* Options */}
        <div className="cel-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <span>Add to the reply</span>
            <span
              className={`px-2 py-0.5 rounded-full ${
                isDone ? 'bg-[#ECFCCB] text-[#3F6212]' : 'bg-[#F1F5F9]'
              }`}
            >
              {picked.length}/{requiredCount}
            </span>
          </div>

          <div className="space-y-2">
            {options.map((option) => {
              const isPicked = picked.includes(option.id);
              const isRejected = rejected.includes(option.id);
              const showFeedback = isPicked || isRejected;
              return (
                <div key={option.id}>
                  <button
                    type="button"
                    disabled={isRejected || (isDone && !isPicked)}
                    onClick={() => handleToggle(option.id)}
                    className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-sm transition-all flex items-start gap-3 ${
                      isPicked
                        ? 'bg-[#F7FEE7] border-[#84CC16]'
                        : isRejected
                          ? 'bg-[#FFFBEB] border-[#FCD34D] text-[#78716C] cursor-default'
                          : isDone
                            ? 'border-[#E2E8F0] opacity-50'
                            : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61] cursor-pointer'
                    } ${isDone && isPicked ? 'cursor-default' : ''}`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isPicked
                          ? 'bg-[#84CC16] border-[#65A30D] text-[#072C2F]'
                          : isRejected
                            ? 'bg-[#FDE68A] border-[#F59E0B] text-[#92400E]'
                            : 'border-[#CBD5E1]'
                      }`}
                    >
                      {isPicked && <Check className="w-3 h-3 stroke-[3]" />}
                      {isRejected && <X className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className={isRejected ? 'line-through decoration-[#D6A43A]/60' : ''}>
                      {option.text}
                    </span>
                  </button>
                  {showFeedback && (
                    <p
                      className={`flex items-start gap-1.5 text-xs mt-1 ml-1 animate-fade-up ${
                        isPicked ? 'text-[#4D7C0F]' : 'text-[#92400E]'
                      }`}
                    >
                      {isPicked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 mt-px shrink-0 text-[#65A30D]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 mt-px shrink-0 text-[#D97706]" />
                      )}
                      {option.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {isDone && (
            <div className="pt-3 border-t border-[#EFE9DC] flex justify-end animate-fade-up">
              <button type="button" onClick={onComplete} className="cel-btn-lime text-sm">
                <Send className="w-4 h-4" />
                Send reply
              </button>
            </div>
          )}
        </div>

        {/* Live email */}
        <div className="lg:sticky lg:top-32">
          <EmailPreview
            lessonCase={lessonCase}
            agentName={agentName}
            paragraphs={paragraphs}
            label={isDone ? 'Final reply' : 'Reply draft'}
            compact
          />
        </div>
      </div>
    </section>
  );
}
