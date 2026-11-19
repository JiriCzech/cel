import { useState } from 'react';
import { ArrowRight, RefreshCw, UserPen } from 'lucide-react';
import { SpeechBubble } from '../components/SpeechBubble';

interface MeetPandaScreenProps {
  existingName: string;
  onCompleteName: (name: string) => void;
  onContinueToLab: () => void;
}

export function MeetPandaScreen({
  existingName,
  onCompleteName,
  onContinueToLab,
}: MeetPandaScreenProps) {
  // If user already has a saved name, start in returning-user greeting mode
  const [mode, setMode] = useState<'returning' | 'intro'>(
    existingName ? 'returning' : 'intro'
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nameInput, setNameInput] = useState(existingName);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = nameInput.trim();
    if (!cleaned) {
      setErrorMsg('Please enter a name or nickname so Panda knows who you are.');
      return;
    }
    setErrorMsg('');
    onCompleteName(cleaned);
  };

  if (mode === 'returning' && existingName) {
    return (
      <section className="max-w-3xl mx-auto py-8 sm:py-14 space-y-6 animate-fade-up">
        <div className="cel-card p-6 sm:p-8">
          <SpeechBubble pose="welcome" avatarSize="xl">
            <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
              Ah, welcome back, {existingName}. Ready to sharpen your support
              skills?
            </p>
            <p className="text-[#475569] text-sm sm:text-base">
              Good to see you again. Whenever you are ready, let’s head into the
              Lab.
            </p>
          </SpeechBubble>

          <div className="mt-7 pt-6 border-t border-[#EFE9DC] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNameInput(existingName);
                  setMode('intro');
                  setStep(3);
                }}
                className="cel-btn-secondary text-xs sm:text-sm"
              >
                <UserPen className="w-4 h-4" />
                Change my name
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('intro');
                  setStep(1);
                }}
                className="cel-btn-secondary text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Replay introduction
              </button>
            </div>

            <button
              type="button"
              onClick={onContinueToLab}
              className="cel-btn-primary text-sm sm:text-base"
            >
              Continue to the Lab
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto py-8 sm:py-14 space-y-6 animate-fade-up">
      {/* Subtle progress dots for the 3-step greeting */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((dot) => (
          <span
            key={dot}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === dot
                ? 'w-7 bg-[#0F5C61]'
                : step > dot
                  ? 'w-2 bg-[#84CC16]'
                  : 'w-2 bg-[#CBD5E1]'
            }`}
          />
        ))}
      </div>

      <div className="cel-card p-6 sm:p-9">
        {step === 1 && (
          <SpeechBubble
            pose="welcome"
            avatarSize="xl"
            onContinue={() => setStep(2)}
            continueLabel="Continue"
          >
            <p className="font-display font-bold text-2xl sm:text-3xl text-[#072C2F]">
              Hey there! I&apos;m Agent Panda.
            </p>
            <p className="text-[#475569] text-sm sm:text-base">
              Welcome to CEL — the Customer Excellence Lab.
            </p>
          </SpeechBubble>
        )}

        {step === 2 && (
          <SpeechBubble
            pose="explaining"
            avatarSize="xl"
            onContinue={() => setStep(3)}
            continueLabel="Continue"
          >
            <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
              I&apos;ll be your guide around here. Together, we&apos;ll explore
              what great customer support really means.
            </p>
            <p className="text-[#475569] text-sm sm:text-base">
              No rushing. No tests. Just practical thinking on real support
              situations.
            </p>
          </SpeechBubble>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <SpeechBubble pose="thinking" avatarSize="xl">
              <p className="font-display font-bold text-xl sm:text-2xl text-[#072C2F]">
                But first… what should I call you?
              </p>
            </SpeechBubble>

            <form
              onSubmit={handleNameSubmit}
              className="cel-surface-warm p-5 sm:p-6 space-y-4 animate-fade-up"
            >
              <div>
                <label
                  htmlFor="agent-name-input"
                  className="block text-xs font-bold uppercase tracking-wider text-[#0F5C61] mb-2"
                >
                  Your Agent Name
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="agent-name-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Your name or agent nickname…"
                    maxLength={40}
                    autoFocus
                    className="flex-1 rounded-xl border border-[#CBD5E1] bg-white px-4 py-3 text-base text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#0F5C61] focus:outline-none focus:ring-2 focus:ring-[#0F5C61]/20"
                  />
                  <button
                    type="submit"
                    className="cel-btn-primary text-sm sm:text-base shrink-0"
                  >
                    Nice to meet you!
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {errorMsg && (
                  <p className="mt-2 text-xs font-medium text-[#B45309]">
                    {errorMsg}
                  </p>
                )}
              </div>

              <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#84CC16]" />
                I&apos;ll remember you next time. No cookies required.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
