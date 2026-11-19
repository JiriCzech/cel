import { Mail } from 'lucide-react';
import type { LessonCase } from '../types';
import type { ReplyParagraph } from '../lib/reply';

interface EmailPreviewProps {
  lessonCase: LessonCase;
  agentName: string;
  paragraphs: ReplyParagraph[];
  /** Number of not-yet-written paragraphs shown as soft placeholder lines. */
  pendingCount?: number;
  /** Key of the paragraph that is still a draft (shown with a caret). */
  draftKey?: string | null;
  label?: string;
  compact?: boolean;
}

export function EmailPreview({
  lessonCase,
  agentName,
  paragraphs,
  pendingCount = 0,
  draftKey = null,
  label = 'Reply',
  compact = false,
}: EmailPreviewProps) {
  const { ticket, reply } = lessonCase;

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs flex flex-col">
      <div className="px-4 sm:px-5 py-3 border-b border-[#EEF2F6] bg-[#FBFAF7] space-y-1 text-xs text-[#64748B]">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0F5C61] uppercase tracking-wider text-[11px]">
            <Mail className="w-3.5 h-3.5" />
            {label}
          </span>
          <span className="font-mono text-[11px]">#{ticket.id}</span>
        </div>
        <div className="truncate">
          <span className="text-[#94A3B8]">To:</span>{' '}
          <span className="text-[#334155] font-medium">{ticket.customerName}</span>{' '}
          &lt;{ticket.customerEmail}&gt;
        </div>
        <div className="truncate">
          <span className="text-[#94A3B8]">Subject:</span>{' '}
          <span className="text-[#334155]">Re: {ticket.subject}</span>
        </div>
      </div>

      <div
        className={`px-4 sm:px-6 py-4 sm:py-5 text-[#1E293B] ${
          compact
            ? 'text-[13px] leading-relaxed space-y-2.5'
            : 'text-sm sm:text-[15px] leading-relaxed space-y-3.5'
        }`}
      >
        <p>{reply.greeting}</p>

        {paragraphs.map((p) => (
          <p
            key={`${p.key}-${p.text.length}`}
            className={`animate-fade-up ${
              p.key === draftKey ? 'text-[#475569]' : ''
            }`}
          >
            {p.text}
            {p.key === draftKey && (
              <span className="inline-block w-[2px] h-[1em] ml-0.5 -mb-[2px] bg-[#0F5C61] animate-pulse" />
            )}
          </p>
        ))}

        {Array.from({ length: pendingCount }).map((_, i) => (
          <div key={`pending-${i}`} className="space-y-1.5 py-0.5" aria-hidden="true">
            <div className="h-2 rounded-full bg-[#F1ECE1] w-full" />
            <div className="h-2 rounded-full bg-[#F1ECE1] w-3/4" />
          </div>
        ))}

        <p className="whitespace-pre-line pt-1">
          {reply.signOff}
          {'\n'}
          {agentName}
          {'\n'}
          <span className="text-[#64748B]">{reply.team}</span>
        </p>
      </div>
    </div>
  );
}
