import { useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  Info,
  Mail,
  Sparkles,
} from 'lucide-react';
import {
  HABITS,
  RESPONSE_OPTIONS,
  THINK_AHEAD_OPTIONS,
} from '../data/caseData';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface Game4ThinkAheadProps {
  onComplete: () => void;
}

export function Game4ThinkAhead({ onComplete }: Game4ThinkAheadProps) {
  const habit = HABITS[3];
  const improvedResponse = RESPONSE_OPTIONS[2].text;
  const insightRef = useRef<HTMLDivElement>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'incorrect' | 'correct'>(
    'idle'
  );
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const toggleOption = (id: string) => {
    if (status === 'correct') return;
    setStatus('idle');
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const scrollToInsight = () => {
    setTimeout(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCheck = () => {
    const correctIds = THINK_AHEAD_OPTIONS.filter((o) => o.isCorrect).map(
      (o) => o.id
    );
    const pickedAvailability = selectedIds.includes('guaranteed-available');
    const pickedUnrelated = selectedIds.includes('unrelated-hosting');
    const missingCorrect = correctIds.some((id) => !selectedIds.includes(id));

    if (pickedAvailability) {
      setStatus('incorrect');
      setFeedbackMsg(
        'Watch out: we have not verified whether alexmorgan.com is currently available to register, so we should never guarantee it.'
      );
      return;
    }

    if (pickedUnrelated) {
      setStatus('incorrect');
      setFeedbackMsg(
        'Unrelated hosting details would distract the customer from what they actually need to do next.'
      );
      return;
    }

    if (missingCorrect) {
      setStatus('incorrect');
      setFeedbackMsg(
        `You selected ${selectedIds.length} of 5 helpful details. Make sure all 5 practical customer questions are covered.`
      );
      return;
    }

    setStatus('correct');
    setFeedbackMsg('');
    scrollToInsight();
  };

  const handleAutoSelectHelpful = () => {
    const correctIds = THINK_AHEAD_OPTIONS.filter((o) => o.isCorrect).map(
      (o) => o.id
    );
    setSelectedIds(correctIds);
    setStatus('correct');
    setFeedbackMsg('');
    scrollToInsight();
  };

  return (
    <section className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <HabitIcon habit="think-ahead" size={44} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
              Mini-Game 4 of 4 · Habit 4
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#072C2F]">
              {habit.title}
            </h1>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFCCB] text-[#3F6212] text-xs font-semibold shrink-0">
          Final challenge
        </span>
      </div>

      {/* Panda Dialogue */}
      <div className="cel-card p-5 sm:p-7">
        {status === 'correct' ? (
          <SpeechBubble pose="encouraging" avatarSize="md" variant="success">
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Good thinking. A complete answer should leave the customer knowing
              exactly what to do next.
            </p>
            <p className="text-sm text-[#334155]">
              When we anticipate practical questions up front—like eligibility
              and where to apply the voucher—we save the customer a frustrating
              second email.
            </p>
          </SpeechBubble>
        ) : status === 'incorrect' ? (
          <SpeechBubble
            pose="surprised"
            avatarSize="md"
            variant="gentle-warning"
          >
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Let&apos;s pause and read that through the customer&apos;s eyes.
            </p>
            <p className="text-sm text-[#475569]">{feedbackMsg}</p>
          </SpeechBubble>
        ) : (
          <SpeechBubble pose="thinking" avatarSize="md">
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              Almost there. One last thing. Imagine receiving this answer as the
              customer. What would you still need to know?
            </p>
            <p className="text-sm text-[#64748B]">
              Select all 5 helpful pieces of information so the customer can
              move forward without guesswork.
            </p>
          </SpeechBubble>
        )}
      </div>

      {/* Improved Response Reference */}
      <div className="cel-surface-warm p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
          <Mail className="w-4 h-4" />
          <span>Our Draft Reply So Far</span>
        </div>
        <p className="text-sm sm:text-base text-[#1E293B] leading-relaxed">
          “{improvedResponse}”
        </p>
      </div>

      {/* Selectable Additional Information */}
      <div className="cel-card p-5 sm:p-7 space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-[#072C2F]">
            What else would help the customer move forward confidently?
          </h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Select the 5 helpful pieces of information ({selectedIds.length}/5
            selected).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THINK_AHEAD_OPTIONS.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const showSuccess = status === 'correct' && option.isCorrect;
            const isWrongHighlight =
              status === 'incorrect' && isSelected && !option.isCorrect;

            return (
              <button
                key={option.id}
                type="button"
                disabled={status === 'correct'}
                onClick={() => toggleOption(option.id)}
                className={`text-left rounded-xl border p-4 transition-all flex items-start gap-3 ${
                  showSuccess
                    ? 'bg-[#F7FEE7] border-[#84CC16]'
                    : isWrongHighlight
                      ? 'bg-[#FFFBEB] border-[#F59E0B]'
                      : isSelected
                        ? 'bg-[#E6F2F2] border-[#0F5C61]'
                        : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61]/60'
                } ${status === 'correct' ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    showSuccess
                      ? 'bg-[#84CC16] border-[#84CC16] text-[#072C2F]'
                      : isWrongHighlight
                        ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                        : isSelected
                          ? 'bg-[#0F5C61] border-[#0F5C61] text-white'
                          : 'bg-white border-[#CBD5E1]'
                  }`}
                >
                  {(isSelected || showSuccess) && (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  )}
                </span>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-[#1E293B] block">
                    {option.text}
                  </span>
                  {isWrongHighlight && (
                    <span className="inline-block text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                      Should not include
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Inline feedback right above Check My Answer */}
        {status === 'incorrect' && (
          <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4 flex items-start gap-3 animate-fade-up">
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-[#92400E]">
                Let&apos;s adjust your selection
              </p>
              <p className="text-xs sm:text-sm text-[#78350F]">{feedbackMsg}</p>
            </div>
          </div>
        )}

        {status !== 'correct' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#64748B]">
              {selectedIds.length} selected
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {status === 'incorrect' && (
                <button
                  type="button"
                  onClick={handleAutoSelectHelpful}
                  className="cel-btn-secondary text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#65A30D]" />
                  Select the 5 helpful items
                </button>
              )}
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleCheck}
                className="cel-btn-primary"
              >
                Check My Answer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Closed Ticket Insight & Case Reality */}
      {status === 'correct' && (
        <div ref={insightRef} className="space-y-5 animate-fade-up scroll-mt-28">
          <div className="cel-card p-6 sm:p-7 border-l-4 border-l-[#0F5C61] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
              <Info className="w-4 h-4" />
              <span>Important Support Insight · Closed vs. Solved</span>
            </div>

            <div className="rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] p-4 text-sm text-[#334155] leading-relaxed space-y-2">
              <p>
                <strong>What happened in the original case:</strong> The agent
                offered to cancel and disconnect the unwanted domain, provided
                the domain voucher, and shared registration instructions. The
                ticket was closed after the agent&apos;s last reply, and there
                was no further customer response.
              </p>
              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Because the customer never replied again, we do not know whether
                they used the voucher or registered their desired domain.
              </p>
            </div>

            <SpeechBubble pose="thinking" avatarSize="md">
              <p className="font-display font-bold text-lg text-[#072C2F]">
                “A customer who does not reply is not necessarily a customer
                whose problem is solved.”
              </p>
              <p className="text-sm text-[#475569]">
                They may have understood—or they may have given up or looked
                elsewhere. Aim for real resolution on the first reply, not
                simply a closed ticket.
              </p>
            </SpeechBubble>
          </div>

          <WisdomBanner quote={habit.motto} />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="cel-btn-lime text-base"
            >
              Continue to Final Reflection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
