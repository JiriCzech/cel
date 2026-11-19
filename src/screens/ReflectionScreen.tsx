import { useState } from 'react';
import { ArrowRight, MessageSquareQuote } from 'lucide-react';
import type { LessonCase } from '../types';
import { HABITS } from '../data';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';

interface ReflectionScreenProps {
  lessonCase: LessonCase;
  agentName: string;
  initialReflection: string;
  onFinishLesson: (reflectionText: string) => void;
}

export function ReflectionScreen({
  lessonCase,
  agentName,
  initialReflection,
  onFinishLesson,
}: ReflectionScreenProps) {
  const [reflection, setReflection] = useState(initialReflection);
  const { takeaways, suggestions } = lessonCase.reflection;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinishLesson(reflection.trim());
  };

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 space-y-6 animate-fade-up">
      <div className="cel-card p-6 sm:p-8 space-y-6">
        <SpeechBubble pose="encouraging" avatarSize="md">
          <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
            Nice work, {agentName}!
          </p>
          <p className="text-sm sm:text-base text-[#475569]">
            Here&apos;s how the four habits played out on {lessonCase.ticket.customerName}&apos;s
            ticket.
          </p>
        </SpeechBubble>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {HABITS.map((habit) => (
            <div key={habit.id} className="cel-surface-warm p-4 flex items-start gap-3.5">
              <HabitIcon habit={habit.id} size={42} className="shrink-0" />
              <div>
                <div className="text-xs font-extrabold tracking-wide text-[#072C2F]">
                  {habit.title}
                </div>
                <p className="text-sm text-[#334155] leading-snug mt-0.5">
                  {takeaways[habit.id]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E5DEC9] bg-white p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-start gap-2.5">
            <MessageSquareQuote className="w-5 h-5 text-[#0F5C61] shrink-0 mt-0.5" />
            <label
              htmlFor="reflection-input"
              className="block font-display font-bold text-base sm:text-lg text-[#072C2F]"
            >
              What will you do differently in your next ticket?
            </label>
          </div>

          <textarea
            id="reflection-input"
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="In my next ticket, I will…"
            className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAF7F2] px-4 py-3 text-sm sm:text-base text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#0F5C61] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C61]/20"
          />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#64748B]">Ideas:</span>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setReflection(suggestion)}
                className="text-xs px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DEC9] text-[#0F5C61] hover:bg-[#E6F2F2] transition-colors cursor-pointer"
              >
                + {suggestion}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="cel-btn-lime text-base px-6 py-3">
              Finish lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
