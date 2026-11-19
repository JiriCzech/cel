import { Quote } from 'lucide-react';

interface WisdomBannerProps {
  quote: string;
  label?: string;
}

export function WisdomBanner({
  quote,
  label = "Agent Panda's Wisdom",
}: WisdomBannerProps) {
  return (
    <div className="rounded-2xl bg-[#072C2F] text-[#FAF7F2] px-5 py-4 sm:px-6 sm:py-5 shadow-md border border-[#167379]/40 animate-fade-up">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#0F5C61] text-[#A3E635] flex items-center justify-center shrink-0 mt-0.5">
          <Quote className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#A3E635] mb-1">
            {label}
          </p>
          <p className="font-display text-base sm:text-lg font-semibold leading-snug text-white">
            “{quote}”
          </p>
        </div>
      </div>
    </div>
  );
}
