import { useState } from 'react';
import { ArrowRight, Mail, Tag } from 'lucide-react';
import { CASE_META, CORE_MOTTO, HABITS } from '../data/caseData';
import { HabitIcon } from '../components/HabitIcon';
import { SpeechBubble } from '../components/SpeechBubble';

interface LessonIntroScreenProps {
  agentName: string;
  onStartGame1: () => void;
}

export function LessonIntroScreen({
  agentName,
  onStartGame1,
}: LessonIntroScreenProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <section className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 animate-fade-up">
      {step === 1 && (
        <div className="cel-card p-6 sm:p-8">
          <SpeechBubble
            pose="explaining"
            avatarSize="xl"
            onContinue={() => setStep(2)}
            continueLabel="Continue"
          >
            <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
              “{CORE_MOTTO}”
            </p>
            <p className="text-[#475569] text-sm sm:text-base">
              Before we jump into today&apos;s customer ticket, {agentName},
              let&apos;s look at what First Time Resolution really means.
            </p>
          </SpeechBubble>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-up">
          <div className="cel-card p-6 sm:p-8">
            <SpeechBubble pose="thinking" avatarSize="lg">
              <p className="font-display font-bold text-xl text-[#072C2F]">
                Solving a customer&apos;s real problem on the first try takes
                four practical habits.
              </p>
              <p className="text-sm sm:text-base text-[#475569]">
                You&apos;ll practice each one through a short interactive
                challenge on a real Webnode domain case.
              </p>
            </SpeechBubble>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {HABITS.map((habit) => (
                <div
                  key={habit.id}
                  className="rounded-2xl border border-[#E6E0D4] bg-[#FAF7F2] p-4 sm:p-5 flex items-start gap-4"
                >
                  <HabitIcon habit={habit.id} size={46} className="shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#0F5C61] text-white">
                        Habit {habit.number}
                      </span>
                      <h3 className="font-display font-extrabold text-sm text-[#072C2F] tracking-wide">
                        {habit.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">
                      {habit.fullDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="cel-btn-primary"
              >
                See today&apos;s case
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-up">
          <div className="cel-card p-6 sm:p-8">
            <SpeechBubble pose="explaining" avatarSize="lg">
              <p className="font-display font-bold text-xl text-[#072C2F]">
                “Every customer has a story. Let&apos;s discover this one.”
              </p>
              <p className="text-sm sm:text-base text-[#475569]">
                A new ticket just arrived in your queue. Take a moment to look at
                the case before we begin.
              </p>
            </SpeechBubble>

            {/* Incoming ticket preview card */}
            <div className="mt-6 rounded-2xl border-2 border-[#0F5C61]/20 bg-[#FAF7F2] p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DEC9]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#0F5C61] text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-mono text-[#64748B]">
                      Ticket #{CASE_META.ticketId} · {CASE_META.receivedAt}
                    </div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-[#072C2F]">
                      Case: The wrong domain
                    </h2>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFCCB] text-[#3F6212] text-xs font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  Domains &amp; Billing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div className="bg-white rounded-xl p-3 border border-[#E7DFD0]">
                  <div className="text-[#64748B] text-xs">Customer</div>
                  <div className="font-semibold text-[#072C2F] mt-0.5">
                    {CASE_META.customerName}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-[#E7DFD0]">
                  <div className="text-[#64748B] text-xs">Intended domain</div>
                  <div className="font-mono font-semibold text-[#0F5C61] mt-0.5">
                    {CASE_META.intendedDomain}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-[#E7DFD0]">
                  <div className="text-[#64748B] text-xs">Purchased by mistake</div>
                  <div className="font-mono font-semibold text-[#B45309] mt-0.5">
                    {CASE_META.purchasedDomain}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#64748B]">
                Note: All customer details in this training case are anonymized
                fictional placeholders inspired by real support scenarios.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onStartGame1}
                className="cel-btn-lime text-base"
              >
                Start Habit 1: Understand
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
