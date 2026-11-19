import type { ReactNode } from 'react';
import type { HabitId, PandaPose } from '../types';
import { HabitIcon } from './HabitIcon';
import { PandaAvatar } from './PandaAvatar';

interface PandaHintProps {
  pose?: PandaPose;
  habit?: HabitId;
  eyebrow?: string;
  tone?: 'default' | 'success' | 'warn';
  children: ReactNode;
  action?: ReactNode;
}

/**
 * Compact Panda + one-line bubble used at the top of every lesson step.
 * Holds the single instruction of the screen (and later its feedback).
 */
export function PandaHint({
  pose = 'thinking',
  habit,
  eyebrow,
  tone = 'default',
  children,
  action,
}: PandaHintProps) {
  const bubble =
    tone === 'success'
      ? 'bg-[#F7FEE7] border-[#BEE37F]'
      : tone === 'warn'
        ? 'bg-[#FFFBEB] border-[#FDE68A]'
        : 'bg-white border-[#E5DEC9]';

  const tail =
    tone === 'success'
      ? 'bg-[#F7FEE7] border-[#BEE37F]'
      : tone === 'warn'
        ? 'bg-[#FFFBEB] border-[#FDE68A]'
        : 'bg-white border-[#E5DEC9]';

  return (
    <div className="flex items-center gap-4">
      <PandaAvatar pose={pose} size="sm" crop="portrait" />
      <div
        key={`${tone}-${pose}`}
        className={`relative flex-1 min-w-0 rounded-2xl border px-4 py-3 sm:px-5 shadow-xs animate-fade-up ${bubble}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-1/2 -left-[7px] -translate-y-1/2 w-3 h-3 rotate-45 border-l border-b ${tail}`}
        />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            {(habit || eyebrow) && (
              <div className="flex items-center gap-1.5 mb-0.5">
                {habit && <HabitIcon habit={habit} size={18} />}
                {eyebrow && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F5C61]">
                    {eyebrow}
                  </span>
                )}
              </div>
            )}
            <p className="font-display font-semibold text-base sm:text-[17px] leading-snug text-[#072C2F]">
              {children}
            </p>
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}
