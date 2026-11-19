import { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, XCircle } from 'lucide-react';
import type { ClueKind, LessonCase } from '../types';
import { HABITS } from '../data';
import { PandaHint } from '../components/PandaHint';

interface Game1UnderstandProps {
  lessonCase: LessonCase;
  onComplete: () => void;
}

const CLUE_MARK: Record<ClueKind, string> = {
  outcome: 'bg-[#CDEDEA]',
  situation: 'bg-[#FDECC8]',
};

const CLUE_SWATCH: Record<ClueKind, string> = {
  outcome: 'bg-[#9FD9D3]',
  situation: 'bg-[#F8D48A]',
};

export function Game1Understand({ lessonCase, onComplete }: Game1UnderstandProps) {
  const habit = HABITS[0];
  const { ticket, message, understand } = lessonCase;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState(false);

  const selected = understand.options.find((o) => o.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    if (solved) return;
    const option = understand.options.find((o) => o.id === id);
    setSelectedId(id);
    setRevealed(true);
    if (option?.isCorrect) setSolved(true);
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-5 animate-fade-up">
      <PandaHint
        pose={solved ? 'encouraging' : 'thinking'}
        tone={solved ? 'success' : 'default'}
        habit="understand"
        eyebrow={habit.label}
      >
        {solved ? habit.motto : understand.prompt}
      </PandaHint>

      {/* Ticket */}
      <article className="cel-card overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-[#EEF2F6]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-full bg-[#0F5C61] text-white flex items-center justify-center font-bold shrink-0">
              {ticket.customerName.charAt(0)}
            </span>
            <div className="min-w-0">
              <div className="font-semibold text-[#072C2F] truncate">
                {ticket.customerName}{' '}
                <span className="font-normal text-sm text-[#64748B]">
                  &lt;{ticket.customerEmail}&gt;
                </span>
              </div>
              <div className="text-sm text-[#334155] truncate">
                {ticket.subject}
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-[#64748B] shrink-0">
            <div className="font-mono">#{ticket.id}</div>
            <div>{ticket.receivedAt}</div>
          </div>
        </header>

        <div className="px-5 sm:px-8 py-6 text-base sm:text-[17px] leading-[1.75] text-[#1E293B] space-y-4 max-w-3xl">
          {message.paragraphs.map((paragraph, pIdx) => (
            <p key={pIdx}>
              {paragraph.map((seg, sIdx) =>
                seg.clue ? (
                  <mark
                    key={sIdx}
                    className={`text-inherit rounded-[3px] box-decoration-clone transition-colors duration-700 ${
                      revealed ? CLUE_MARK[seg.clue] : 'bg-transparent'
                    }`}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={sIdx}>{seg.text}</span>
                )
              )}
            </p>
          ))}
          <p className="whitespace-pre-line">{message.signature}</p>
        </div>

        {revealed && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#EEF2F6] border-t border-[#EEF2F6] animate-fade-up">
            {(['outcome', 'situation'] as ClueKind[]).map((kind) => (
              <div key={kind} className="bg-[#FBFAF7] px-5 sm:px-6 py-4">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  <span className={`w-3 h-3 rounded-sm ${CLUE_SWATCH[kind]}`} />
                  {understand.analysis[kind].label}
                </div>
                <p className="text-sm text-[#1E293B] leading-relaxed">
                  {understand.analysis[kind].summary}
                </p>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Question */}
      <div className="cel-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display font-bold text-lg text-[#072C2F]">
            {understand.question}
          </h2>
          {!revealed && (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F5C61] hover:underline cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Check between the lines
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {understand.options.map((option) => {
            const isSelected = selectedId === option.id;
            const isRight = isSelected && option.isCorrect;
            const isWrong = isSelected && !option.isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                disabled={solved}
                onClick={() => handleSelect(option.id)}
                className={`text-left rounded-xl border px-4 py-3 text-sm sm:text-[15px] transition-all flex items-start gap-3 ${
                  isRight
                    ? 'bg-[#F7FEE7] border-[#84CC16] ring-2 ring-[#84CC16]/25'
                    : isWrong
                      ? 'bg-[#FFFBEB] border-[#F59E0B]'
                      : solved
                        ? 'bg-white border-[#E2E8F0] opacity-50'
                        : 'bg-white border-[#E2E8F0] hover:border-[#0F5C61] cursor-pointer'
                }`}
              >
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 ${
                    isRight
                      ? 'border-[#65A30D] bg-[#84CC16]'
                      : isWrong
                        ? 'border-[#F59E0B] bg-[#FDE68A]'
                        : 'border-[#CBD5E1]'
                  }`}
                />
                <span className="text-[#1E293B]">{option.text}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            key={selected.id}
            className="flex flex-wrap items-center justify-between gap-3 pt-1 animate-fade-up"
          >
            <p
              className={`flex items-start gap-2 text-sm ${
                selected.isCorrect ? 'text-[#3F6212]' : 'text-[#92400E]'
              }`}
            >
              {selected.isCorrect ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-[#65A30D]" />
              ) : (
                <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#D97706]" />
              )}
              <span>
                {selected.feedback}
                {!selected.isCorrect && ' Try again.'}
              </span>
            </p>
            {solved && (
              <button type="button" onClick={onComplete} className="cel-btn-lime text-sm">
                Continue to Investigate
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
