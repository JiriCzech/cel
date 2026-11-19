import { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MailCheck,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react';
import {
  EMAIL_ANATOMY_PARTS,
  HABITS,
  RESPONSE_OPTIONS,
} from '../data/caseData';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface Game3OwnershipProps {
  onComplete: () => void;
}

export function Game3Ownership({ onComplete }: Game3OwnershipProps) {
  const habit = HABITS[2];
  const step2Ref = useRef<HTMLDivElement>(null);

  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    null
  );
  const [hasChosenCorrect, setHasChosenCorrect] = useState(false);
  const [inspectedPartIds, setInspectedPartIds] = useState<string[]>([]);
  const [activePartId, setActivePartId] = useState<string | null>(null);

  const selectedOption = RESPONSE_OPTIONS.find(
    (o) => o.id === selectedResponseId
  );
  const isWrong = Boolean(selectedOption && !selectedOption.isCorrect);

  const handleSelectResponse = (id: string) => {
    setSelectedResponseId(id);
    const chosen = RESPONSE_OPTIONS.find((o) => o.id === id);
    if (chosen?.isCorrect) {
      setHasChosenCorrect(true);
      // Auto-select first building block so the breakdown is immediately helpful
      setActivePartId(EMAIL_ANATOMY_PARTS[0].id);
      setInspectedPartIds([EMAIL_ANATOMY_PARTS[0].id]);
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  };

  const handleInspectPart = (partId: string) => {
    setActivePartId(partId);
    setInspectedPartIds((prev) =>
      prev.includes(partId) ? prev : [...prev, partId]
    );
  };

  const activeIndex = EMAIL_ANATOMY_PARTS.findIndex(
    (p) => p.id === activePartId
  );
  const nextPart =
    activeIndex >= 0 && activeIndex < EMAIL_ANATOMY_PARTS.length - 1
      ? EMAIL_ANATOMY_PARTS[activeIndex + 1]
      : null;

  const activePart = EMAIL_ANATOMY_PARTS.find((p) => p.id === activePartId);

  return (
    <section className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <HabitIcon habit="ownership" size={44} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
              Mini-Game 3 of 4 · Habit 3
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#072C2F]">
              {habit.title}
            </h1>
          </div>
        </div>
        {hasChosenCorrect && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFCCB] text-[#3F6212] text-xs font-semibold shrink-0">
            Parts viewed: {inspectedPartIds.length}/{EMAIL_ANATOMY_PARTS.length}
          </span>
        )}
      </div>

      {/* Panda Dialogue */}
      <div className="cel-card p-5 sm:p-7">
        {hasChosenCorrect ? (
          <SpeechBubble pose="encouraging" avatarSize="md" variant="success">
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Exactly. We cannot always give customers the outcome they
              originally wanted. But we can still help them find the best
              available solution.
            </p>
            <p className="text-sm text-[#334155]">
              Taking ownership does not mean promising something impossible. It
              means clearly explaining what can and cannot be done and helping
              the customer with the next available step.
            </p>
          </SpeechBubble>
        ) : isWrong && selectedOption ? (
          <SpeechBubble
            pose="surprised"
            avatarSize="md"
            variant="gentle-warning"
          >
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Let&apos;s look closer at how that feels to the customer.
            </p>
            <p className="text-sm text-[#475569]">{selectedOption.feedback}</p>
          </SpeechBubble>
        ) : (
          <SpeechBubble pose="explaining" avatarSize="md">
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              Now comes the interesting part. Knowing the facts is good. Using
              them to help the customer is even better.
            </p>
            <p className="text-sm text-[#64748B]">
              Choose the reply that best takes ownership of the customer&apos;s
              situation.
            </p>
          </SpeechBubble>
        )}
      </div>

      {/* Part 1: Choose Response Card */}
      <div className="space-y-3">
        {RESPONSE_OPTIONS.map((option) => {
          const isSelected = selectedResponseId === option.id;
          const isCorrectPicked = isSelected && option.isCorrect;
          const isWrongPicked = isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              disabled={hasChosenCorrect}
              onClick={() => handleSelectResponse(option.id)}
              className={`w-full text-left cel-card p-5 transition-all border-2 ${
                isCorrectPicked
                  ? 'border-[#84CC16] bg-[#F7FEE7]'
                  : isWrongPicked
                    ? 'border-[#F59E0B] bg-[#FFFBEB]'
                    : hasChosenCorrect
                      ? 'border-transparent opacity-55'
                      : 'border-transparent hover:border-[#0F5C61] cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isCorrectPicked
                      ? 'bg-[#84CC16] text-[#072C2F]'
                      : isWrongPicked
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-[#E6F2F2] text-[#0F5C61]'
                  }`}
                >
                  {option.title}
                </span>
                {isCorrectPicked && (
                  <CheckCircle2 className="w-5 h-5 text-[#65A30D]" />
                )}
              </div>
              <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed">
                “{option.text}”
              </p>
            </button>
          );
        })}
      </div>

      {/* Inline feedback when Option A or B is clicked */}
      {isWrong && selectedOption && (
        <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4 flex items-start gap-3 animate-fade-up">
          <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#78350F]">
            <strong>{selectedOption.title}:</strong> {selectedOption.feedback}
          </div>
        </div>
      )}

      {/* Part 2: Interactive Email Anatomy */}
      {hasChosenCorrect && (
        <div
          ref={step2Ref}
          className="cel-card p-5 sm:p-7 space-y-5 animate-fade-up scroll-mt-28"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#65A30D]">
                Step 2 · Why This Reply Works
              </span>
              <h2 className="font-display font-bold text-lg sm:text-xl text-[#072C2F] mt-1">
                Inspect the 4 building blocks of taking ownership
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <MousePointerClick className="w-4 h-4 text-[#0F5C61]" />
              <span>Click any highlighted part to explore</span>
            </div>
          </div>

          {/* Editable-looking email preview */}
          <div className="rounded-2xl border border-[#CBD5E1] bg-white overflow-hidden shadow-xs">
            <div className="bg-[#F6F1E7] border-b border-[#E5DEC9] px-4 py-2.5 flex items-center justify-between text-xs text-[#475569]">
              <div className="flex items-center gap-2 font-medium">
                <MailCheck className="w-4 h-4 text-[#0F5C61]" />
                <span>Reply Draft · To: Alex Morgan</span>
              </div>
              <span className="font-mono text-[11px] text-[#64748B] hidden sm:inline">
                Re: Wrong domain paid by mistake
              </span>
            </div>

            <div className="p-5 sm:p-6 text-sm sm:text-base leading-loose text-[#1E293B] space-y-3">
              <p className="text-[#64748B]">Hi Alex,</p>
              <p className="leading-loose">
                {EMAIL_ANATOMY_PARTS.map((part, index) => {
                  const isInspected = inspectedPartIds.includes(part.id);
                  const isActive = activePartId === part.id;
                  return (
                    <span key={part.id}>
                      <button
                        type="button"
                        onClick={() => handleInspectPart(part.id)}
                        className={`inline text-left rounded-lg px-2 py-0.5 transition-all cursor-pointer border ${
                          isActive
                            ? 'bg-[#0F5C61] text-white border-[#0F5C61] font-medium'
                            : isInspected
                              ? 'bg-[#ECFCCB] text-[#3F6212] border-[#BEE37F]'
                              : 'bg-[#E6F2F2] text-[#072C2F] border-[#0F5C61]/40 hover:bg-[#0F5C61] hover:text-white'
                        }`}
                      >
                        {part.text}
                      </button>
                      {index < EMAIL_ANATOMY_PARTS.length - 1 ? ' ' : ''}
                    </span>
                  );
                })}
              </p>
              <p className="text-[#64748B]">Best regards, Webnode Support</p>
            </div>
          </div>

          {/* Pill buttons for quick inspection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {EMAIL_ANATOMY_PARTS.map((part) => {
              const isInspected = inspectedPartIds.includes(part.id);
              const isActive = activePartId === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => handleInspectPart(part.id)}
                  className={`text-left rounded-xl p-3 border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-[#0F5C61] text-white border-[#0F5C61]'
                      : isInspected
                        ? 'bg-[#F7FEE7] text-[#3F6212] border-[#BEE37F]'
                        : 'bg-[#FAF7F2] text-[#072C2F] border-[#E5DEC9] hover:border-[#0F5C61]'
                  }`}
                >
                  <span>{part.label}</span>
                  {isInspected && (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {activePart && (
            <div
              key={activePart.id}
              className="rounded-xl bg-[#FAF7F2] border border-[#0F5C61]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0F5C61] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
                    {activePart.label}
                  </div>
                  <p className="text-sm text-[#1E293B] mt-1">
                    {activePart.why}
                  </p>
                </div>
              </div>
              {nextPart && (
                <button
                  type="button"
                  onClick={() => handleInspectPart(nextPart.id)}
                  className="cel-btn-secondary text-xs shrink-0 self-end sm:self-center"
                >
                  Next part
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Unblocked immediately once Option C is chosen */}
      {hasChosenCorrect && (
        <div className="space-y-5 animate-fade-up">
          <WisdomBanner quote={habit.motto} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="cel-btn-lime text-base"
            >
              Continue to Habit 4: Think Ahead
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
