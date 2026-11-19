import { useState } from 'react';
import { ChevronDown, Filter, Inbox, Search } from 'lucide-react';
import type { LessonCase, QueueTicket, TicketPriority, Tone } from '../types';
import { PandaHint } from '../components/PandaHint';

interface LessonIntroScreenProps {
  lessonCase: LessonCase;
  onStartGame1: () => void;
}

const AVATAR_COLORS = [
  'bg-[#0F5C61] text-white',
  'bg-[#F59E0B] text-white',
  'bg-[#6366F1] text-white',
  'bg-[#EC4899] text-white',
  'bg-[#14B8A6] text-white',
];

const PRIORITY_DOT: Record<TicketPriority, string> = {
  Low: 'bg-[#22C55E]',
  Medium: 'bg-[#3B82F6]',
  High: 'bg-[#F59E0B]',
  Urgent: 'bg-[#EF4444]',
};

const STATE_STYLE: Record<Tone, string> = {
  ok: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
  info: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
  warn: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
  danger: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
  muted: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
};

export function LessonIntroScreen({
  lessonCase,
  onStartGame1,
}: LessonIntroScreenProps) {
  const { queue } = lessonCase;
  const [nudgeId, setNudgeId] = useState<string | null>(null);

  const handleRowClick = (ticket: QueueTicket) => {
    if (ticket.isLessonTicket) {
      onStartGame1();
    } else {
      setNudgeId(ticket.id);
    }
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-5 animate-fade-up">
      <PandaHint pose="explaining">{queue.prompt}</PandaHint>

      <div className="cel-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#EEF2F6] bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E6F2F2] text-[#0F5C61] flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display font-bold text-sm sm:text-base text-[#072C2F]">
                {queue.viewName}
              </h2>
              <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
              <span className="ml-1 text-xs font-semibold text-[#64748B] bg-[#F1F5F9] rounded-md px-1.5 py-0.5">
                {queue.tickets.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5" />
              Search tickets
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5" />
              Sort: Date created
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748B] bg-[#FBFAF7] border-b border-[#EEF2F6]">
                <th className="px-4 sm:px-5 py-2.5 font-semibold">Contact</th>
                <th className="px-3 py-2.5 font-semibold">Subject</th>
                <th className="px-3 py-2.5 font-semibold">State</th>
                <th className="px-3 py-2.5 font-semibold hidden md:table-cell">Group</th>
                <th className="px-3 py-2.5 font-semibold">Priority</th>
                <th className="px-3 sm:pr-5 py-2.5 font-semibold hidden sm:table-cell">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {queue.tickets.map((ticket, idx) => {
                const isLesson = Boolean(ticket.isLessonTicket);
                return (
                  <tr
                    key={ticket.id}
                    onClick={() => handleRowClick(ticket)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleRowClick(ticket);
                      }
                    }}
                    className={`group border-b border-[#F1F5F9] last:border-b-0 cursor-pointer transition-colors outline-none focus-visible:bg-[#F0F9F9] ${
                      isLesson
                        ? 'bg-[#F7FEE7]/60 hover:bg-[#ECFCCB]/70'
                        : 'hover:bg-[#FAFAF9]'
                    }`}
                  >
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            AVATAR_COLORS[idx % AVATAR_COLORS.length]
                          }`}
                        >
                          {ticket.contactName.charAt(0)}
                          {isLesson && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#84CC16] border-2 border-white animate-pulse" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`truncate ${
                              isLesson ? 'font-bold text-[#072C2F]' : 'font-medium text-[#334155]'
                            }`}
                          >
                            {ticket.contactName}
                          </div>
                          <div className="text-xs text-[#94A3B8] truncate">
                            {ticket.createdAgo}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 min-w-[200px]">
                      <div
                        className={`${
                          isLesson
                            ? 'font-semibold text-[#072C2F] group-hover:text-[#0F5C61] group-hover:underline'
                            : 'text-[#334155]'
                        }`}
                      >
                        {ticket.subject}{' '}
                        <span className="font-mono text-xs text-[#94A3B8] font-normal">
                          #{ticket.id}
                        </span>
                      </div>
                      {nudgeId === ticket.id && (
                        <div className="text-xs text-[#B45309] mt-0.5 animate-fade-up">
                          A teammate is already on this one. Grab the new ticket.
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block whitespace-nowrap text-[11px] font-semibold border rounded-md px-2 py-0.5 ${
                          STATE_STYLE[ticket.stateTone]
                        }`}
                      >
                        {ticket.state}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#475569] whitespace-nowrap hidden md:table-cell">
                      {ticket.group}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-[#334155]">
                        <span
                          className={`w-2 h-2 rounded-full ${PRIORITY_DOT[ticket.priority]}`}
                        />
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-3 sm:pr-5 py-3 text-[#475569] hidden sm:table-cell">
                      {ticket.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
