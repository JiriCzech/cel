import { useState } from 'react';
import type { PandaPose } from '../types';

interface PandaAvatarProps {
  pose?: PandaPose;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** `portrait` zooms in on the head so it is never cut off in small frames. */
  crop?: 'full' | 'portrait';
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
  xs: 'w-14 h-14',
  sm: 'w-20 h-20',
  md: 'w-28 h-28 sm:w-32 sm:h-32',
  lg: 'w-36 h-36 sm:w-44 sm:h-44',
  xl: 'w-44 h-44 sm:w-52 sm:h-52',
};

function FallbackPandaSvg() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-label="Agent Panda">
      <rect width="200" height="200" fill="#FAF7F2" />
      <path
        d="M36 200 C36 150, 62 136, 100 136 C138 136, 164 150, 164 200 Z"
        fill="#0F5C61"
      />
      <circle cx="58" cy="56" r="18" fill="#1E293B" />
      <circle cx="142" cy="56" r="18" fill="#1E293B" />
      <ellipse cx="100" cy="92" rx="48" ry="44" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <ellipse cx="78" cy="86" rx="14" ry="17" transform="rotate(-14 78 86)" fill="#1E293B" />
      <ellipse cx="122" cy="86" rx="14" ry="17" transform="rotate(14 122 86)" fill="#1E293B" />
      <circle cx="80" cy="85" r="4.5" fill="#FFFFFF" />
      <circle cx="120" cy="85" r="4.5" fill="#FFFFFF" />
      <circle cx="79" cy="85" r="14" fill="none" stroke="#92400E" strokeWidth="2.8" />
      <circle cx="121" cy="85" r="14" fill="none" stroke="#92400E" strokeWidth="2.8" />
      <path d="M93 85 H107" stroke="#92400E" strokeWidth="2.8" />
      <ellipse cx="100" cy="100" rx="7" ry="4.5" fill="#1E293B" />
      <path
        d="M90 109 Q100 117 110 109"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PandaAvatar({
  pose = 'welcome',
  size = 'lg',
  crop = 'full',
  className = '',
}: PandaAvatarProps) {
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({});
  const imageSrc = POSE_IMAGE_MAP[pose];
  const hasError = Boolean(failedSrcs[imageSrc]);
  const isSmall = size === 'xs' || size === 'sm';

  return (
    <div
      className={`relative shrink-0 select-none ${SIZE_CLASSES[size]} ${className}`}
    >
      <div
        className={`w-full h-full overflow-hidden bg-[#FAF7F2] border-2 border-[#E5DEC9] shadow-sm ${
          isSmall ? 'rounded-2xl' : 'rounded-3xl animate-float-gentle'
        }`}
      >
        {!hasError ? (
          <img
            src={imageSrc}
            alt={`Agent Panda (${pose})`}
            className={`w-full h-full object-cover ${
              crop === 'portrait' ? 'scale-[1.55] origin-[50%_24%]' : ''
            }`}
            onError={() =>
              setFailedSrcs((prev) => ({ ...prev, [imageSrc]: true }))
            }
          />
        ) : (
          <FallbackPandaSvg />
        )}
      </div>
    </div>
  );
}
