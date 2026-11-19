import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Lock, XCircle } from 'lucide-react';
import type { LessonCase } from '../types';
import { HABITS } from '../data';
import { PandaHint } from '../components/PandaHint';
import { EmailPreview } from '../components/EmailPreview';
import { buildReplyParagraphs } from '../lib/reply';

interface Game3OwnershipProps {
  lessonCase: LessonCase;
  agentName: string;
  onComplete: () => void;
}

export function Game3Ownership({
  lessonCase,
  agentName,
  onComplete,
}: Game3OwnershipProps) {
  const habit = HABITS[2];
  const { steps } = lessonCase.ownership;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [locked, setLocked] = useState<Record<string, string>>({});
  const [lockedFeedback, setLockedFeedback] = useState<Record<string, string>>({});
  const [draftOptionId, setDraftOptionId] = useState<string | null>(null);

  const isDone = currentIdx >= steps.length;
  const currentStep = isDone ? null : steps[currentIdx];
  const draftOption =
    currentStep?.options.find((o) => o.id === draftOptionId) ?? null;

  const handlePick = (optionId: string) => {
    if (!currentStep) return;
    const option = currentStep.options.find((o) => o.id === optionId);
    if (!option) return;

    if (option.isCorrect) {
      setLocked((prev) => ({ ...prev, [currentStep.id]: option.text }));
      setLockedFeedback((prev) => ({ ...prev, [currentStep.id]: option.feedback }));
      setDraftOptionId(null);
      setCurrentIdx((i) => i + 1);
    } else {
      setDraftOptionId(optionId);
    }
  };

  const previewTexts: Record<string, string | undefined> = { ...locked };
  if (currentStep && draftOption) previewTexts[currentStep.id] = draftOption.text;
  const paragraphs = buildReplyParagraphs(lessonCase, previewTexts);
  const pendingCount = steps.length - paragraphs.length;

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-5 animate-fade-up">
      <PandaHint
        pose={isDone ? 'encouraging' : 'explaining'}
        tone={isDone ? 'success' : 'default'}
        habit="ownership"
        eyebrow={habit.label}
      >
        {isDone ? habit.motto : lessonCase.ownership.prompt}
      </PandaHint>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Reply builder */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isLocked = Boolean(locked[step.id]);
            const isCurrent = idx === currentIdx;

            if (isLocked) {
              return (
                <div
                  key={step.id}
                  className="rounded-xl border border-[#D9EFB5] bg-[#F7FEE7] px-4 py-3 animate-fade-up"
                >
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-[#3F6212]">
                    <span className="w-5 h-5 rounded-full bg-[#84CC16] text-[#072C2F] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    {step.label}
                  </div>
                  <p className="text-xs text-[#4D7C0F] mt-1 pl-[30px]">
                    {lockedFeedback[step.id]}
                  </p>
                </div>
              );
            }

            if (!isCurrent) {
              return (
                <div
                  key={step.id}
                  className="rounded-xl border border-[#EDE7DA] bg-[#FBFAF7] px-4 py-3 flex items-center gap-2.5 text-sm font-semibold text-[#94A3B8]"
                >
                  <span className="w-5 h-5 rounded-full border border-[#D6CCB8] flex items-center justify-center text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  {step.label}
                  <Lock className="w-3.5 h-3.5 ml-auto" />
                </div>
              );
            }

            return (
              <div
                key={step.id}
                className="cel-card p-4 sm:p-5 space-y-3 border-[#0F5C61]/30 animate-fade-up"
              >
                <div className="flex items-center gap-2.5 text-sm font-bold text-[#072C2F]">
                  <span className="w-5 h-5 rounded-full bg-[#0F5C61] text-white flex items-center justify-center text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  {step.label}
                </div>

                <div className="space-y-2">
                  {step.options.map((option) => {
                    const isWrong = option.id === draftOptionId;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handlePick(option.id)}
                        className={`w-full text-left rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed transition-all cursor-pointer ${
                          isWrong
                            ? 'bg-[#FFFBEB] border-[#F59E0B] text-[#1E293B]'
                            : 'bg-white border-[#E2E8F0] text-[#1E293B] hover:border-[#0F5C61] hover:bg-[#F8FBFB]'
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                {draftOption && (
                  <p
                    key={draftOption.id}
                    className="flex items-start gap-1.5 text-xs text-[#92400E] animate-fade-up"
                  >
                    <XCircle className="w-3.5 h-3.5 mt-px shrink-0 text-[#D97706]" />
                    {draftOption.feedback} Pick another version.
                  </p>
                )}
              </div>
            );
          })}

          {isDone && (
            <div className="flex items-center justify-between gap-3 pt-2 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3F6212]">
                <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
                Reply drafted
              </span>
              <button type="button" onClick={onComplete} className="cel-btn-lime text-sm">
                Continue to Think Ahead
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-32">
          <EmailPreview
            lessonCase={lessonCase}
            agentName={agentName}
            paragraphs={paragraphs}
            pendingCount={pendingCount}
            draftKey={draftOption ? currentStep?.id : null}
            label="Reply draft"
          />
        </div>
      </div>
    </section>
  );
}
