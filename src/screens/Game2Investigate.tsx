import { useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FolderKanban,
  Globe,
  History,
  Sparkles,
  Ticket,
} from 'lucide-react';
import {
  CASE_META,
  HABITS,
  INVESTIGATION_FINDINGS,
  TOOL_TABS,
} from '../data/caseData';
import type { ToolTab } from '../types';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';
import { WisdomBanner } from '../components/WisdomBanner';

interface Game2InvestigateProps {
  onComplete: () => void;
}

const TAB_ICONS: Record<ToolTab['id'], typeof FolderKanban> = {
  project: FolderKanban,
  domains: Globe,
  orders: CreditCard,
  vouchers: Ticket,
  history: History,
};

export function Game2Investigate({ onComplete }: Game2InvestigateProps) {
  const habit = HABITS[1];
  const step2Ref = useRef<HTMLDivElement>(null);

  const [activeTabId, setActiveTabId] = useState<ToolTab['id'] | null>(null);
  const [discoveredTabIds, setDiscoveredTabIds] = useState<ToolTab['id'][]>([]);
  const [selectedFindingIds, setSelectedFindingIds] = useState<string[]>([]);
  const [feedbackState, setFeedbackState] = useState<
    'idle' | 'incorrect' | 'correct'
  >('idle');
  const [incorrectReason, setIncorrectReason] = useState('');

  const allCluesCollected = discoveredTabIds.length === TOOL_TABS.length;
  const remainingTabs = TOOL_TABS.filter(
    (t) => !discoveredTabIds.includes(t.id)
  );
  const activeTab = TOOL_TABS.find((t) => t.id === activeTabId) ?? null;

  const scrollToStep2 = () => {
    setTimeout(() => {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectTab = (tabId: ToolTab['id']) => {
    setActiveTabId(tabId);
    const nextDiscovered = discoveredTabIds.includes(tabId)
      ? discoveredTabIds
      : [...discoveredTabIds, tabId];
    setDiscoveredTabIds(nextDiscovered);

    if (
      !discoveredTabIds.includes(tabId) &&
      nextDiscovered.length === TOOL_TABS.length
    ) {
      scrollToStep2();
    }
  };

  const handleCheckNextUnvisited = () => {
    if (remainingTabs.length > 0) {
      handleSelectTab(remainingTabs[0].id);
    }
  };

  const toggleFinding = (id: string) => {
    if (feedbackState === 'correct') return;
    setFeedbackState('idle');
    setSelectedFindingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleVerifyFindings = () => {
    const correctIds = INVESTIGATION_FINDINGS.filter((f) => f.isCorrect).map(
      (f) => f.id
    );
    const hasWrongPick = selectedFindingIds.some(
      (id) => !correctIds.includes(id)
    );
    const missingCorrect = correctIds.some(
      (id) => !selectedFindingIds.includes(id)
    );

    if (hasWrongPick) {
      setFeedbackState('incorrect');
      setIncorrectReason(
        'One or more selected items are not supported by the internal tools (marked in amber above). Uncheck them and select only the 4 verified facts.'
      );
      return;
    }

    if (missingCorrect) {
      setFeedbackState('incorrect');
      setIncorrectReason(
        `You selected ${selectedFindingIds.length} of 4 verified facts. Check your Evidence Panel and select all 4 verified facts before continuing.`
      );
      return;
    }

    setFeedbackState('correct');
    setIncorrectReason('');
  };

  const handleAutoSelectCorrect = () => {
    const correctIds = INVESTIGATION_FINDINGS.filter((f) => f.isCorrect).map(
      (f) => f.id
    );
    setSelectedFindingIds(correctIds);
    setFeedbackState('correct');
    setIncorrectReason('');
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <HabitIcon habit="investigate" size={44} />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
              Mini-Game 2 of 4 · Habit 2
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-extrabold text-[#072C2F]">
              {habit.title}
            </h1>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFCCB] text-[#3F6212] text-xs font-semibold shrink-0">
          Tabs: {discoveredTabIds.length}/{TOOL_TABS.length}
        </span>
      </div>

      {/* Panda Dialogue */}
      <div className="cel-card p-5 sm:p-7">
        {feedbackState === 'correct' ? (
          <SpeechBubble pose="encouraging" avatarSize="md" variant="success">
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Excellent. Notice how much clearer the situation becomes when we
              look at the whole picture.
            </p>
            <p className="text-sm text-[#334155]">
              Checking every relevant tab first kept us from guessing or giving
              wrong advice.
            </p>
          </SpeechBubble>
        ) : feedbackState === 'incorrect' ? (
          <SpeechBubble
            pose="thinking"
            avatarSize="md"
            variant="gentle-warning"
          >
            <p className="font-display font-bold text-lg text-[#072C2F]">
              Interesting. But are we looking at the whole picture?
            </p>
            <p className="text-sm text-[#475569]">{incorrectReason}</p>
          </SpeechBubble>
        ) : (
          <SpeechBubble pose="thinking" avatarSize="md">
            <p className="font-display font-bold text-lg sm:text-xl text-[#072C2F]">
              Good. Now let&apos;s investigate. A wise agent never guesses when
              the answer can be found.
            </p>
            <p className="text-sm text-[#64748B]">
              Explore all 5 tabs in the simulated support tools below to collect
              the case facts.
            </p>
          </SpeechBubble>
        )}
      </div>

      {/* Simulated Internal Tools + Evidence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Simulated Internal Console */}
        <div className="lg:col-span-7 cel-card overflow-hidden flex flex-col">
          <div className="bg-[#072C2F] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
              </div>
              <span className="text-xs font-mono font-semibold text-[#E2F1F1]">
                Internal Support Tools · #{CASE_META.ticketId}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A3E635]">
              SIMULATED VIEW
            </span>
          </div>

          {/* Clickable Tabs */}
          <div className="bg-[#F6F1E7] border-b border-[#E5DEC9] px-3 py-2 flex flex-wrap gap-1.5">
            {TOOL_TABS.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              const isVisited = discoveredTabIds.includes(tab.id);
              const isActive = activeTabId === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0F5C61] text-white shadow-xs'
                      : isVisited
                        ? 'bg-white text-[#0F5C61] border border-[#BEE37F]'
                        : 'bg-white text-[#334155] border border-[#E2E8F0] hover:border-[#0F5C61]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {isVisited ? (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-[#A3E635]' : 'text-[#65A30D]'
                      }`}
                    />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="p-5 sm:p-6 flex-1 bg-white flex flex-col justify-between gap-4">
            {!activeTab ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#FAF7F2] p-6">
                <Globe className="w-8 h-8 text-[#0F5C61] mb-2 opacity-80" />
                <p className="font-display font-bold text-base text-[#072C2F]">
                  Select a tool tab above to begin inspecting
                </p>
                <p className="text-xs sm:text-sm text-[#64748B] mt-1 max-w-sm">
                  Check Project, Domains, Orders, Vouchers, and History to gather
                  every verified fact before answering.
                </p>
              </div>
            ) : (
              <div key={activeTab.id} className="space-y-4 animate-fade-up">
                <div className="flex items-center justify-between border-b border-[#EFE9DC] pb-3">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#072C2F]">
                      {activeTab.label}
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      {activeTab.subtitle}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECFCCB] text-[#3F6212] text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Clue saved
                  </span>
                </div>

                <div className="space-y-3">
                  {activeTab.fields.map((field) => (
                    <div
                      key={field.label}
                      className={`rounded-xl p-3.5 border ${
                        field.highlight
                          ? 'bg-[#FAF7F2] border-[#0F5C61]/30'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                      }`}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                        {field.label}
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-[#072C2F] mt-0.5 font-sans">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick action footer inside tools console */}
            <div className="pt-3 border-t border-[#EFE9DC] flex flex-wrap items-center justify-between gap-2">
              {!allCluesCollected ? (
                <button
                  type="button"
                  onClick={handleCheckNextUnvisited}
                  className="cel-btn-secondary text-xs w-full sm:w-auto"
                >
                  Check next unvisited tab ({remainingTabs.length} left)
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={scrollToStep2}
                  className="cel-btn-lime text-xs sm:text-sm w-full sm:w-auto"
                >
                  All 5 clues collected! Answer the question below
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Evidence Panel */}
        <div className="lg:col-span-5 cel-card p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
                <ClipboardList className="w-4 h-4" />
                <span>Evidence Panel</span>
              </div>
              <span className="text-xs font-semibold text-[#64748B]">
                {discoveredTabIds.length}/{TOOL_TABS.length} clues
              </span>
            </div>

            <div className="space-y-2.5">
              {TOOL_TABS.map((tab) => {
                const isCollected = discoveredTabIds.includes(tab.id);
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer ${
                      isCollected
                        ? 'bg-[#F7FEE7] border-[#BEE37F] animate-fade-up'
                        : 'bg-[#FAF7F2] border-[#E7DFD0] hover:border-[#0F5C61]/50 opacity-85'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#072C2F]">
                        {tab.clueTitle}
                      </span>
                      {isCollected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#65A30D] shrink-0" />
                      ) : (
                        <span className="text-[11px] font-semibold text-[#0F5C61]">
                          Check {tab.label} →
                        </span>
                      )}
                    </div>
                    {isCollected && (
                      <p className="text-xs text-[#334155] mt-1 leading-relaxed">
                        {tab.clueSummary}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFE9DC]">
            {!allCluesCollected ? (
              <button
                type="button"
                onClick={handleCheckNextUnvisited}
                className="cel-btn-secondary text-xs w-full"
              >
                Check next unvisited tab ({remainingTabs.length} left)
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={scrollToStep2}
                className="cel-btn-lime text-sm w-full"
              >
                All 5 clues collected! Answer the question below
                <ArrowDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Part 2: Select the verified findings */}
      {allCluesCollected && (
        <div
          id="investigate-step-2"
          ref={step2Ref}
          className="cel-card p-5 sm:p-7 space-y-5 animate-fade-up scroll-mt-28"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#65A30D]">
              Step 2 · Summarize Verified Facts
            </span>
            <h2 className="font-display font-bold text-lg sm:text-xl text-[#072C2F] mt-1">
              What can we now tell the customer?
            </h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Select the 4 verified facts confirmed by your investigation (
              {selectedFindingIds.length}/4 selected).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INVESTIGATION_FINDINGS.map((finding) => {
              const isChecked = selectedFindingIds.includes(finding.id);
              const showSuccess =
                feedbackState === 'correct' && finding.isCorrect;
              const isIncorrectHighlight =
                feedbackState === 'incorrect' && isChecked && !finding.isCorrect;

              return (
                <button
                  key={finding.id}
                  type="button"
                  disabled={feedbackState === 'correct'}
                  onClick={() => toggleFinding(finding.id)}
                  className={`text-left rounded-xl border p-4 transition-all flex items-start gap-3 ${
                    showSuccess
                      ? 'bg-[#F7FEE7] border-[#84CC16]'
                      : isIncorrectHighlight
                        ? 'bg-[#FFFBEB] border-[#F59E0B]'
                        : isChecked
                          ? 'bg-[#E6F2F2] border-[#0F5C61]'
                          : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61]/60'
                  } ${feedbackState === 'correct' ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      showSuccess
                        ? 'bg-[#84CC16] border-[#84CC16] text-[#072C2F]'
                        : isIncorrectHighlight
                          ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                          : isChecked
                            ? 'bg-[#0F5C61] border-[#0F5C61] text-white'
                            : 'bg-white border-[#CBD5E1]'
                    }`}
                  >
                    {(isChecked || showSuccess) && (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    )}
                  </span>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-[#1E293B] leading-snug block">
                      {finding.text}
                    </span>
                    {isIncorrectHighlight && (
                      <span className="inline-block text-[11px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                        Not verified by tools
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inline validation feedback right near the button */}
          {feedbackState === 'incorrect' && (
            <div className="rounded-xl border border-[#FCD34D] bg-[#FFFBEB] p-4 flex items-start gap-3 animate-fade-up">
              <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#92400E]">
                  Let&apos;s adjust your selection
                </p>
                <p className="text-xs sm:text-sm text-[#78350F]">
                  {incorrectReason}
                </p>
              </div>
            </div>
          )}

          {feedbackState === 'correct' && (
            <div className="rounded-xl border border-[#BEE37F] bg-[#F7FEE7] p-4 flex items-center justify-between flex-wrap gap-3 animate-fade-up">
              <div className="flex items-center gap-2.5 text-sm font-bold text-[#3F6212]">
                <CheckCircle2 className="w-5 h-5 text-[#65A30D] shrink-0" />
                <span>
                  All 4 verified facts confirmed! You are ready for the next
                  habit.
                </span>
              </div>
              <button
                type="button"
                onClick={onComplete}
                className="cel-btn-lime text-sm"
              >
                Continue to Habit 3: Take Ownership
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {feedbackState !== 'correct' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-[#64748B]">
                {selectedFindingIds.length} selected
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {feedbackState === 'incorrect' && (
                  <button
                    type="button"
                    onClick={handleAutoSelectCorrect}
                    className="cel-btn-secondary text-xs sm:text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#65A30D]" />
                    Select the 4 verified facts for me
                  </button>
                )}
                <button
                  type="button"
                  disabled={selectedFindingIds.length === 0}
                  onClick={handleVerifyFindings}
                  className="cel-btn-primary"
                >
                  Verify Findings
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {feedbackState === 'correct' && (
        <div className="space-y-5 animate-fade-up">
          <WisdomBanner quote={habit.motto} />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="cel-btn-lime text-base"
            >
              Continue to Habit 3: Take Ownership
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
