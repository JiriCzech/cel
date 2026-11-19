import { useState } from 'react';
import {
  HelpCircle,
  Lightbulb,
  Search,
  Sparkles,
  ThumbsUp,
  Hand,
} from 'lucide-react';
import type { PandaPose } from '../types';

interface PandaAvatarProps {
  pose?: PandaPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const POSE_IMAGE_MAP: Record<PandaPose, string> = {
  welcome: '/assets/panda/panda-welcome.jpg',
  thinking: '/assets/panda/panda-thinking.jpg',
  explaining: '/assets/panda/panda-explaining.jpg',
  encouraging: '/assets/panda/panda-encouraging.jpg',
  celebrating: '/assets/panda/panda-celebrating.jpg',
  surprised: '/assets/panda/panda-thinking.jpg',
};

const SIZE_CLASSES: Record<NonNullable<PandaAvatarProps['size']>, string> = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28 sm:w-32 sm:h-32',
  lg: 'w-36 h-36 sm:w-44 sm:h-44',
  xl: 'w-44 h-44 sm:w-52 sm:h-52',
};

function PoseBadge({ pose }: { pose: PandaPose }) {
  switch (pose) {
    case 'welcome':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#84CC16] text-[#072C2F] shadow-md border-2 border-white">
          <Hand className="w-4 h-4" />
        </span>
      );
    case 'thinking':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F5C61] text-[#ECFCCB] shadow-md border-2 border-white">
          <Search className="w-4 h-4" />
        </span>
      );
    case 'explaining':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#ECFCCB] text-[#3F6212] shadow-md border-2 border-white">
          <Lightbulb className="w-4 h-4" />
        </span>
      );
    case 'encouraging':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#84CC16] text-[#072C2F] shadow-md border-2 border-white">
          <ThumbsUp className="w-4 h-4" />
        </span>
      );
    case 'celebrating':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#84CC16] text-[#072C2F] shadow-md border-2 border-white">
          <Sparkles className="w-4 h-4" />
        </span>
      );
    case 'surprised':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] shadow-md border-2 border-white">
          <HelpCircle className="w-4 h-4" />
        </span>
      );
  }
}

function FallbackPandaSvg({ pose }: { pose: PandaPose }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Agent Panda">
      <rect width="200" height="200" fill="#FAF7F2" />
      {/* Hoodie shoulders */}
      <path
        d="M36 200 C36 150, 62 136, 100 136 C138 136, 164 150, 164 200 Z"
        fill="#0F5C61"
      />
      <path d="M100 144 V200" stroke="#072C2F" strokeWidth="3" />
      <path d="M88 148 L88 176" stroke="#A3E635" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 148 L112 176" stroke="#A3E635" strokeWidth="3" strokeLinecap="round" />
      {/* Headset around neck */}
      <path
        d="M68 140 C68 164, 132 164, 132 140"
        fill="none"
        stroke="#334155"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Ears */}
      <circle cx="58" cy="56" r="18" fill="#1E293B" />
      <circle cx="142" cy="56" r="18" fill="#1E293B" />
      {/* Head */}
      <ellipse cx="100" cy="92" rx="48" ry="44" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      {/* Eye patches */}
      <ellipse cx="78" cy="86" rx="14" ry="17" transform="rotate(-14 78 86)" fill="#1E293B" />
      <ellipse cx="122" cy="86" rx="14" ry="17" transform="rotate(14 122 86)" fill="#1E293B" />
      {/* Eyes */}
      <circle cx="80" cy="85" r="4.5" fill="#FFFFFF" />
      <circle cx="120" cy="85" r="4.5" fill="#FFFFFF" />
      <circle cx="81" cy="85" r="2.2" fill="#0F172A" />
      <circle cx="119" cy="85" r="2.2" fill="#0F172A" />
      {/* Glasses */}
      <circle cx="79" cy="85" r="14" fill="none" stroke="#92400E" strokeWidth="2.8" />
      <circle cx="121" cy="85" r="14" fill="none" stroke="#92400E" strokeWidth="2.8" />
      <path d="M93 85 H107" stroke="#92400E" strokeWidth="2.8" />
      {/* Nose & gentle smile */}
      <ellipse cx="100" cy="100" rx="7" ry="4.5" fill="#1E293B" />
      <path
        d={
          pose === 'surprised'
            ? 'M94 111 Q100 107 106 111'
            : 'M90 109 Q100 117 110 109'
        }
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Wise white beard */}
      <path
        d="M72 114 C72 142, 86 164, 100 168 C114 164, 128 142, 128 114 C118 122, 82 122, 72 114 Z"
        fill="#F8FAFC"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function PandaAvatar({
  pose = 'welcome',
  size = 'lg',
  className = '',
}: PandaAvatarProps) {
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});
  const imageSrc = POSE_IMAGE_MAP[pose];
  const hasError = Boolean(failedSrcs[imageSrc]);

  return (
    <div
      className={`relative shrink-0 select-none ${SIZE_CLASSES[size]} ${className}`}
    >
      <div
        className={`w-full h-full rounded-3xl overflow-hidden bg-[#FAF7F2] border-2 border-[#E5DEC9] shadow-md transition-transform duration-300 ${
          pose === 'surprised' ? '-rotate-2' : 'animate-float-gentle'
        }`}
      >
        {!hasError ? (
          <img
            src={imageSrc}
            alt={`Agent Panda (${pose})`}
            className="w-full h-full object-cover"
            onError={() =>
              setFailedSrcs((prev) => ({ ...prev, [imageSrc]: true }))
            }
          />
        ) : (
          <FallbackPandaSvg pose={pose} />
        )}
      </div>

      {size !== 'sm' && (
        <div
          key={pose}
          className="absolute -bottom-2 -right-2 animate-pop-in"
          aria-hidden="true"
        >
          <PoseBadge pose={pose} />
        </div>
      )}
    </div>
  );
}
