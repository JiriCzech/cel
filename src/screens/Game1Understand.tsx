import { useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  Mail,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import {
  CASE_META,
  HABITS,
  REAL_NEED_OPTIONS,
  TICKET_CLUES,
} from '../data/caseData';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface Game1UnderstandProps {
  onComplete: () => void;
}

export function Game1Understand({ onComplete }: Game1UnderstandProps) {
  const habit = HABITS[0];
  const step2Ref = useRef<HTMLDivElement>(null);

  const [introStep, setIntroStep] = useState<1 | 2>(1);
  const [revealedClues, setRevealedClues] = useState<string[]>([]);
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSolved, setHasSolved] = useState(false);

  const allCluesFound = revealedClues.length === TICKET_CLUES.length;

  const scrollToStep2 = () => {
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClueClick = (clueId: string) => {
    setActiveClueId(clueId);
    const nextRevealed = revealedClues.includes(clueId)
      ? revealedClues
      : [...revealedClues, clueId];
    setRevealedClues(nextRevealed);

    if (
      !revealedClues.includes(clueId) &&
      nextRevealed.length === TICKET_CLUES.length
    ) {
      scrollToStep2();
    }
  };

  const handleRevealAllClues = () => {
    setRevealedClues(TICKET_CLUES.map((c) => c.id));
    setActiveClueId(TICKET_CLUES[0].id);
    scrollToStep2();
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const chosen = REAL_NEED_OPTIONS.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      setHasSolved(true);
    }
  };

  const selectedObj = REAL_NEED_OPTIONS.find((o) => o.id === selectedOption);
  const isWrongAttempt = Boolean(selectedObj && !selectedObj.isCorrect);

  return (
    <section className="max-w-4xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Habit Header Strip */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <HabitIcon habit="understand" size={44} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
              Mini-Game 1 of 4 · Habit 1
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#072C2F]">
              {habit.title}
            </h1>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F2F2] text-[#0F5C61] text-xs font-semibold shrink-0">
          Clues: {revealedClues.length}/{TICKET_CLUES.length}
        </span>
      </div>

      {/* Panda Dialogue */}
      <div className="cel-card p-5 sm:p-7">
        {introStep === 1 ? (
          <SpeechBubble
            pose="explaining"
            avatarSize="md"
            onContinue={() => setIntroStep(2)}
            continueLabel="Open customer message"
          >
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              Let&apos;s begin with the most important skill. Understanding.
            </p>
            <p className="text-sm text-[#64748B]">{habit.fullDesc}</p>
          </SpeechBubble>
        ) : hasSolved ? (
          <SpeechBubble pose="encouraging" avatarSize="md" variant="success">
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Exactly. The domain is only part of the story.
            </p>
            <p className="text-sm sm:text-base text-[#334155]">
              The customer wants to end up with the right website address
              without paying for something they never intended to buy.
            </p>
          </SpeechBubble>
        ) : isWrongAttempt ? (
          <SpeechBubble
            pose="surprised"
            avatarSize="md"
            variant="gentle-warning"
          >
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Not quite. Look at what the customer originally wanted.
            </p>
            <p className="text-sm sm:text-base text-[#475569]">
              What would make this situation feel resolved from their
              perspective? Do not worry about a wrong turn. Even a wise mind
              learns by looking again.
            </p>
          </SpeechBubble>
        ) : (
          <SpeechBubble pose="thinking" avatarSize="md">
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              Read between the lines. What does this customer really want?
            </p>
            <p className="text-sm text-[#64748B]">
              Click the 3 highlighted phrases in the customer&apos;s message to
              uncover what each detail tells us, then choose the customer&apos;s
              real need below.
            </p>
          </SpeechBubble>
        )}
      </div>

      {/* Interactive Ticket Deconstruction */}
      {introStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-up">
          {/* Ticket Card */}
          <div className="lg:col-span-7 cel-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE9DC] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#0F5C61] text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-sm font-bold text-[#072C2F]">
                    {CASE_META.customerName}
                  </div>
                  <div className="text-xs font-mono text-[#64748B]">
                    {CASE_META.customerEmail} · #{CASE_META.ticketId}
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-[#64748B]">
                {CASE_META.receivedAt}
              </span>
            </div>

            <div className="rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] p-4 sm:p-5 text-base sm:text-lg leading-relaxed text-[#1E293B]">
              “Hello, I just paid for a domain, but{' '}
              <ClueButton
                text="I wanted alexmorgan.com"
                revealed={revealedClues.includes('wanted-domain')}
                active={activeClueId === 'wanted-domain'}
                onClick={() => handleClueClick('wanted-domain')}
              />
              . I ended up with{' '}
              <span className="font-mono text-sm bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                designer-portfolio.net
              </span>
              .{' '}
              <ClueButton
                text="I thought that was the registration page"
                revealed={revealedClues.includes('thought-page')}
                active={activeClueId === 'thought-page'}
                onClick={() => handleClueClick('thought-page')}
              />
              .{' '}
              <ClueButton
                text="I don't want to pay for a domain I cannot use"
                revealed={revealedClues.includes('cannot-use')}
                active={activeClueId === 'cannot-use'}
                onClick={() => handleClueClick('cannot-use')}
              />
              .”
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-[#0F5C61] shrink-0" />
                <span>
                  {allCluesFound
                    ? 'All 3 clues uncovered! Click any highlighted phrase to review.'
                    : `Click the highlighted phrases above (${
                        TICKET_CLUES.length - revealedClues.length
                      } remaining).`}
                </span>
              </div>
              {!allCluesFound && (
                <button
                  type="button"
                  onClick={handleRevealAllClues}
                  className="inline-flex items-center gap-1 font-semibold text-[#0F5C61] hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Reveal all 3 clues
                </button>
              )}
            </div>
          </div>

          {/* Between the Lines Insight Panel */}
          <div className="lg:col-span-5 cel-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5C61] mb-3">
                <Eye className="w-4 h-4" />
                <span>Between the Lines</span>
              </div>

              {revealedClues.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#FAF7F2] p-5 text-center text-sm text-[#64748B]">
                  Click a highlighted phrase in the customer message to inspect
                  what it reveals.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {TICKET_CLUES.filter((c) => revealedClues.includes(c.id)).map(
                    (clue) => {
                      const isActive = activeClueId === clue.id;
                      return (
                        <button
                          key={clue.id}
                          type="button"
                          onClick={() => setActiveClueId(clue.id)}
                          className={`w-full text-left rounded-xl p-3.5 border transition-all cursor-pointer animate-fade-up ${
                            isActive
                              ? 'bg-[#E6F2F2] border-[#0F5C61]'
                              : 'bg-[#FAF7F2] border-[#E5DEC9] hover:border-[#0F5C61]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F5C61]">
                              {clue.label}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#65A30D]" />
                          </div>
                          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                            {clue.insight}
                          </p>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Part 2: Always visible once ticket is opened so user never gets stuck */}
      {introStep === 2 && (
        <div
          ref={step2Ref}
          className="cel-card p-5 sm:p-7 space-y-4 animate-fade-up scroll-mt-28"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#65A30D]">
              Step 2 · Identify the Real Need
            </span>
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#072C2F] mt-1">
              What is the customer&apos;s real need?
            </h2>
          </div>

          <div className="space-y-2.5">
            {REAL_NEED_OPTIONS.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrectSelected = isSelected && option.isCorrect;
              const isWrongSelected = isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={hasSolved}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all flex items-start gap-3 ${
                    isCorrectSelected
                      ? 'bg-[#F7FEE7] border-[#84CC16] ring-2 ring-[#84CC16]/30'
                      : isWrongSelected
                        ? 'bg-[#FFFBEB] border-[#F59E0B]'
                        : hasSolved
                          ? 'bg-[#FAF7F2] border-[#E5DEC9] opacity-60'
                          : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61] hover:bg-[#F8FAFC] cursor-pointer'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCorrectSelected
                        ? 'bg-[#84CC16] text-[#072C2F]'
                        : isWrongSelected
                          ? 'bg-[#FEF3C7] text-[#92400E]'
                          : 'bg-[#E6F2F2] text-[#0F5C61]'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-[#1E293B] pt-0.5">
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline feedback right inside Step 2 */}
          {isWrongAttempt && (
            <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4 flex items-start gap-3 animate-fade-up">
              <AlertCircle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#78350F]">
                <strong>Not quite.</strong> Look at what the customer originally
                wanted (<code>alexmorgan.com</code>) and why they reached out.
                Try another answer above.
              </div>
            </div>
          )}

          {hasSolved && (
            <div className="rounded-xl border border-[#BEE37F] bg-[#F7FEE7] p-4 flex items-center justify-between flex-wrap gap-3 animate-fade-up">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3F6212]">
                <CheckCircle2 className="w-5 h-5 text-[#65A30D] shrink-0 mt-0.5" />
                <span>
                  <strong>Exactly!</strong> The customer wants the right website
                  address without paying for something they never intended to
                  buy.
                </span>
              </div>
              <button
                type="button"
                onClick={onComplete}
                className="cel-btn-lime text-sm"
              >
                Continue to Habit 2: Investigate
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Wisdom & Next CTA */}
      {hasSolved && (
        <div className="space-y-5 animate-fade-up">
          <WisdomBanner quote={habit.motto} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="cel-btn-lime text-base"
            >
              Continue to Habit 2: Investigate
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

interface ClueButtonProps {
  text: string;
  revealed: boolean;
  active: boolean;
  onClick: () => void;
}

function ClueButton({
  text,
  revealed,
  active,
  onClick,
}: ClueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline text-left rounded-lg px-2 py-0.5 font-semibold transition-all cursor-pointer border ${
        active
          ? 'bg-[#0F5C61] text-white border-[#0F5C61] shadow-xs'
          : revealed
            ? 'bg-[#ECFCCB] text-[#3F6212] border-[#BEE37F]'
            : 'bg-[#E6F2F2] text-[#0F5C61] border-[#0F5C61]/40 hover:bg-[#0F5C61] hover:text-white'
      }`}
    >
      {text}
    </button>
  );
}
