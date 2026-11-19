import { useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  FolderKanban,
  Globe,
  History,
  Lock,
  MousePointerClick,
  Ticket,
  XCircle,
} from 'lucide-react';
import type {
  LessonCase,
  ToolCell,
  ToolTab,
  ToolTabId,
  Tone,
} from '../types';
import { HABITS } from '../data';
import { PandaHint } from '../components/PandaHint';

interface Game2InvestigateProps {
  lessonCase: LessonCase;
  onComplete: () => void;
}

const TAB_ICONS: Record<ToolTabId, typeof FolderKanban> = {
  project: FolderKanban,
  domains: Globe,
  orders: CreditCard,
  vouchers: Ticket,
  history: History,
};

const TONE_BADGE: Record<Tone, string> = {
  ok: 'bg-[#DCFCE7] text-[#166534]',
  info: 'bg-[#E0F2FE] text-[#075985]',
  warn: 'bg-[#FEF3C7] text-[#92400E]',
  danger: 'bg-[#FEE2E2] text-[#991B1B]',
  muted: 'bg-[#F1F5F9] text-[#475569]',
};

const TONE_TEXT: Record<Tone, string> = {
  ok: 'text-[#3F6212]',
  info: 'text-[#075985]',
  warn: 'text-[#B45309]',
  danger: 'text-[#B91C1C]',
  muted: 'text-[#475569]',
};

function Cell({ value }: { value: ToolCell }) {
  if (typeof value === 'string') return <>{value}</>;
  return (
    <span
      className={`inline-block text-[11px] font-semibold rounded-md px-1.5 py-0.5 ${TONE_BADGE[value.tone]}`}
    >
      {value.text}
    </span>
  );
}

function ToolContent({ tab }: { tab: ToolTab }) {
  const { view } = tab;

  if (view.type === 'fields') {
    return (
      <dl className="divide-y divide-[#F1F5F9]">
        {view.fields.map((f) => (
          <div key={f.label} className="grid grid-cols-[150px_1fr] gap-3 py-2.5 text-sm">
            <dt className="text-[#64748B]">{f.label}</dt>
            <dd className="text-[#0F172A] font-medium">
              <Cell value={f.value} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  if (view.type === 'table') {
    return (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-lg border border-[#EEF2F6]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] text-left text-[11px] uppercase tracking-wider text-[#64748B]">
                {view.columns.map((c) => (
                  <th key={c} className="px-3 py-2 font-semibold whitespace-nowrap">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-t border-[#F1F5F9]">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-3 py-2.5 align-top ${
                        cIdx === 0 ? 'font-medium text-[#0F172A]' : 'text-[#334155]'
                      }`}
                    >
                      <Cell value={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {view.note && (
          <p className="text-xs text-[#64748B] leading-relaxed">{view.note}</p>
        )}
      </div>
    );
  }

  return (
    <ol className="relative border-l border-[#E2E8F0] ml-1.5 space-y-2.5">
      {view.entries.map((e, idx) => (
        <li key={idx} className="pl-4 relative text-sm">
          <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#94A3B8]" />
          <span className="font-mono text-xs text-[#64748B] mr-2">{e.time}</span>
          <span className="text-[#0F172A]">{e.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function Game2Investigate({ lessonCase, onComplete }: Game2InvestigateProps) {
  const habit = HABITS[1];
  const { investigate } = lessonCase;
  const { tabs, check, toolsContext } = investigate;

  const [activeTabId, setActiveTabId] = useState<ToolTabId | null>(null);
  const [visited, setVisited] = useState<ToolTabId[]>([]);
  const [answerId, setAnswerId] = useState<string | null>(null);

  const allVisited = visited.length === tabs.length;
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;
  const answer = check.options.find((o) => o.id === answerId) ?? null;
  const solved = Boolean(answer?.isCorrect);

  const openTab = (id: ToolTabId) => {
    setActiveTabId(id);
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-5 animate-fade-up">
      <PandaHint
        pose={solved ? 'encouraging' : 'thinking'}
        tone={solved ? 'success' : 'default'}
        habit="investigate"
        eyebrow={habit.label}
      >
        {solved ? habit.motto : investigate.prompt}
      </PandaHint>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] gap-5 items-start">
        {/* Webnode Tools */}
        <div className="cel-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#072C2F] text-white text-sm">
            <span className="px-2 py-0.5 rounded-md bg-[#84CC16] text-[#072C2F] font-bold text-xs">
              Tools
            </span>
            <span className="text-[#E2F1F1] truncate">
              Project #{toolsContext.projectId}
              <span className="mx-2 text-[#5E8F92]">·</span>
              <span className="font-mono text-xs">{toolsContext.projectUrl}</span>
            </span>
          </div>

          <div
            role="tablist"
            className="flex border-b border-[#E2E8F0] bg-[#FBFAF7] overflow-x-auto"
          >
            {tabs.map((tab) => {
              const Icon = TAB_ICONS[tab.id];
              const isActive = tab.id === activeTabId;
              const isVisited = visited.includes(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => openTab(tab.id)}
                  className={`relative flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#0F5C61] text-[#0F5C61] bg-white'
                      : 'border-transparent text-[#475569] hover:text-[#0F5C61] hover:bg-white/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isVisited ? (
                    <Check className="w-3.5 h-3.5 text-[#65A30D] stroke-[3]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 sm:p-5 min-h-[290px]">
            {activeTab ? (
              <div key={activeTab.id} className="animate-fade-up">
                <ToolContent tab={activeTab} />
              </div>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-center text-sm text-[#64748B] gap-2">
                <MousePointerClick className="w-6 h-6 text-[#0F5C61]" />
                Open a tab to start.
              </div>
            )}
          </div>
        </div>

        {/* Case facts */}
        <aside className="cel-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-[15px] text-[#072C2F]">
              Case facts
            </h2>
            <span className="text-xs font-semibold text-[#64748B]">
              {visited.length}/{tabs.length}
            </span>
          </div>

          <ul className="space-y-1.5">
            {tabs.map((tab) => {
              const unlocked = visited.includes(tab.id);
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => openTab(tab.id)}
                    className={`w-full text-left grid grid-cols-[76px_1fr] gap-2 items-baseline rounded-lg px-2.5 py-2 text-[13px] transition-colors cursor-pointer ${
                      unlocked
                        ? 'bg-[#FBFAF7] hover:bg-[#F3EFE6]'
                        : 'hover:bg-[#FBFAF7]'
                    }`}
                  >
                    <span className="text-[#64748B] font-medium truncate">
                      {unlocked ? tab.fact.label : tab.label}
                    </span>
                    {unlocked ? (
                      <span
                        className={`font-semibold animate-fade-up ${
                          tab.fact.tone ? TONE_TEXT[tab.fact.tone] : 'text-[#0F172A]'
                        }`}
                      >
                        {tab.fact.value}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
                        <Lock className="w-3 h-3" />
                        Check {tab.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {allVisited && (
            <div className="rounded-xl border border-[#0F5C61]/25 bg-[#F6FAF9] p-3.5 sm:p-4 space-y-2.5 animate-fade-up">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F5C61]">
                  Choose solution
                </div>
                <h3 className="font-display font-bold text-sm text-[#072C2F] mt-0.5">
                  {check.question}
                </h3>
              </div>
              {check.options.map((option) => {
                const isSelected = answerId === option.id;
                const isRight = isSelected && option.isCorrect;
                const isWrong = isSelected && !option.isCorrect;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={solved}
                    onClick={() => setAnswerId(option.id)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-[13px] leading-snug transition-all ${
                      isRight
                        ? 'bg-[#F7FEE7] border-[#84CC16]'
                        : isWrong
                          ? 'bg-[#FFFBEB] border-[#F59E0B]'
                          : solved
                            ? 'bg-white border-[#E2E8F0] opacity-50'
                            : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61] cursor-pointer'
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}

              {answer && (
                <p
                  key={answer.id}
                  className={`flex items-start gap-1.5 text-xs animate-fade-up ${
                    answer.isCorrect ? 'text-[#3F6212]' : 'text-[#92400E]'
                  }`}
                >
                  {answer.isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 mt-px shrink-0 text-[#65A30D]" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 mt-px shrink-0 text-[#D97706]" />
                  )}
                  {answer.feedback}
                </p>
              )}

              {solved && (
                <button
                  type="button"
                  onClick={onComplete}
                  className="cel-btn-lime text-sm w-full"
                >
                  Continue to Ownership
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
