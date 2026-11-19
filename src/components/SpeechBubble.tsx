import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import type { PandaPose } from '../types';
import { PandaAvatar } from './PandaAvatar';

interface SpeechBubbleProps {
  pose?: PandaPose;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  speaker?: string;
  children: ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  variant?: 'default' | 'success' | 'gentle-warning';
  className?: string;
}

export function SpeechBubble({
  pose = 'welcome',
  avatarSize = 'lg',
  speaker = 'Agent Panda',
  children,
  onContinue,
  continueLabel = 'Continue',
  variant = 'default',
  className = '',
}: SpeechBubbleProps) {
  const bubbleStyles =
    variant === 'success'
      ? 'bg-[#F7FEE7] border-[#BEE37F]'
      : variant === 'gentle-warning'
        ? 'bg-[#FFFBEB] border-[#FDE68A]'
        : 'bg-white border-[#E5DEC9]';

  const tailBorderColor =
    variant === 'success'
      ? 'border-[#BEE37F] bg-[#F7FEE7]'
      : variant === 'gentle-warning'
        ? 'border-[#FDE68A] bg-[#FFFBEB]'
        : 'border-[#E5DEC9] bg-white';

  return (
    <div
      className={`flex flex-col sm:flex-row items-center sm:items-start gap-5 ${className}`}
    >
      <PandaAvatar pose={pose} size={avatarSize} />

      <div
        className={`relative flex-1 w-full rounded-2xl border p-5 sm:p-6 shadow-sm animate-fade-up ${bubbleStyles}`}
      >
        {/* Left tail on sm+ screens */}
        <div
          className={`hidden sm:block absolute top-8 -left-2.5 w-4 h-4 rotate-45 border-l border-b ${tailBorderColor}`}
          aria-hidden="true"
        />
        {/* Top tail on mobile */}
        <div
          className={`sm:hidden absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t ${tailBorderColor}`}
          aria-hidden="true"
        />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F5C61]">
            {speaker}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
        </div>

        <div className="text-[#1E293B] text-base sm:text-lg leading-relaxed space-y-2">
          {children}
        </div>

        {onContinue && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="cel-btn-primary text-sm"
            >
              {continueLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
