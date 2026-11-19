import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import type { ScreenId } from '../types';

interface FeedbackWidgetProps {
  currentScreen: ScreenId;
  agentName: string;
}

type FeedbackType = 'like' | 'improve' | 'idea';

interface FeedbackNote {
  id: string;
  timestamp: string;
  agent: string;
  screenId: ScreenId;
  screen: string;
  type: FeedbackType;
  comment: string;
}

const STORAGE_KEY = 'cel_team_feedback_v1';

const SCREEN_LABELS: Record<ScreenId, string> = {
  'meet-panda': 'Welcome',
  'lab-hub': 'First Time Resolution',
  'lesson-intro': 'Intro',
  'game-1': '1. Understand',
  'game-2': '2. Investigate',
  'game-3': '3. Ownership',
  'game-4': '4. Think Ahead',
  reflection: 'Reflection',
  completion: 'Summary',
};

const LESSON_OVERVIEW_SCREENS: ScreenId[] = [
  'lesson-intro',
  'game-1',
  'game-2',
  'game-3',
  'game-4',
  'reflection',
];

const REACTIONS: {
  id: FeedbackType;
  label: string;
  badge: string;
}[] = [
  { id: 'like', label: '👍 Like', badge: 'bg-[#ECFCCB] text-[#3F6212]' },
  { id: 'improve', label: '🔧 Improve', badge: 'bg-[#FEF3C7] text-[#92400E]' },
  { id: 'idea', label: '💡 Idea', badge: 'bg-[#E0F2FE] text-[#075985]' },
];

function loadNotes(): FeedbackNote[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: FeedbackNote[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Ignore storage unavailability
  }
}

function sendToWebhook(note: FeedbackNote): void {
  const url = import.meta.env.VITE_FEEDBACK_WEBHOOK_URL?.trim();
  if (!url) return;

  try {
    void fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        timestamp: note.timestamp,
        agent: note.agent,
        screen: note.screen,
        type: REACTIONS.find((r) => r.id === note.type)?.label ?? note.type,
        comment: note.comment,
      }),
    });
  } catch {
    // Local storage already keeps the note safely
  }
}

function formatFeedbackForSlack(notes: FeedbackNote[], agentName: string): string {
  const author = notes[0]?.agent || agentName;
  const screenOrder = Object.keys(SCREEN_LABELS) as ScreenId[];
  const grouped = new Map<string, FeedbackNote[]>();

  for (const screenId of screenOrder) {
    const label = SCREEN_LABELS[screenId];
    const items = notes.filter((n) => n.screenId === screenId || n.screen === label);
    if (items.length > 0 && !grouped.has(label)) {
      grouped.set(label, items);
    }
  }

  for (const note of notes) {
    if (!grouped.has(note.screen)) {
      grouped.set(note.screen, [note]);
    }
  }

  const lines: string[] = [`*CEL Feedback – ${author}* (${notes.length})`];
  for (const [screen, items] of grouped) {
    lines.push('');
    lines.push(`*${screen}*`);
    for (const item of items) {
      const reaction =
        REACTIONS.find((r) => r.id === item.type)?.label ?? item.type;
      lines.push(`• ${reaction}: ${item.comment}`);
    }
  }
  return lines.join('\n');
}

export function FeedbackWidget({
  currentScreen,
  agentName,
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<FeedbackNote[]>(loadNotes);
  const [type, setType] = useState<FeedbackType>('like');
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const currentScreenLabel = SCREEN_LABELS[currentScreen];

  const updateAllNotes = (next: FeedbackNote[]) => {
    setNotes(next);
    saveNotes(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = comment.trim();
    if (!cleaned) return;

    if (editingId) {
      const target = notes.find((n) => n.id === editingId);
      const updatedNote: FeedbackNote = {
        id: editingId,
        timestamp: new Date().toISOString(),
        agent: agentName,
        screenId: target?.screenId ?? currentScreen,
        screen: target?.screen ?? currentScreenLabel,
        type,
        comment: cleaned,
      };
      updateAllNotes(notes.map((n) => (n.id === editingId ? updatedNote : n)));
      sendToWebhook(updatedNote);
      setEditingId(null);
      setComment('');
      return;
    }

    const newNote: FeedbackNote = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      agent: agentName,
      screenId: currentScreen,
      screen: currentScreenLabel,
      type,
      comment: cleaned,
    };
    updateAllNotes([newNote, ...notes]);
    sendToWebhook(newNote);
    setComment('');
  };

  const handleStartEdit = (note: FeedbackNote) => {
    setEditingId(note.id);
    setType(note.type);
    setComment(note.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setComment('');
  };

  const handleDelete = (id: string) => {
    if (editingId === id) handleCancelEdit();
    updateAllNotes(notes.filter((n) => n.id !== id));
  };

  const handleCopyAll = async () => {
    if (notes.length === 0) return;
    const text = formatFeedbackForSlack(notes, agentName);

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Screen feedback"
          className="fixed bottom-16 right-4 z-40 w-[calc(100vw-2rem)] sm:w-96 max-h-[82vh] flex flex-col rounded-2xl border border-[#CBD5E1] bg-white shadow-xl animate-pop-in overflow-hidden"
        >
          {/* Context Header */}
          <div className="px-4 py-3 bg-[#072C2F] text-white flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#A3E635]">
                Feedback · {agentName}
              </div>
              <div className="font-display font-bold text-sm truncate">
                {currentScreenLabel}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback"
              className="p-1.5 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mini-overview of lesson screens */}
          <div className="px-4 py-2.5 bg-[#FAF7F2] border-b border-[#ECE4D6] flex flex-wrap gap-1.5 shrink-0">
            {LESSON_OVERVIEW_SCREENS.map((screenId) => {
              const label = SCREEN_LABELS[screenId];
              const isCurrent = screenId === currentScreen;
              const hasNote = notes.some(
                (n) => n.screenId === screenId || n.screen === label
              );
              return (
                <span
                  key={screenId}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                    isCurrent
                      ? 'bg-[#0F5C61] text-white font-semibold'
                      : 'bg-white border border-[#E5DEC9] text-[#475569]'
                  }`}
                >
                  {hasNote && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {label}
                </span>
              );
            })}
          </div>

          {/* Scrollable Form + Saved Notes */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {REACTIONS.map((item) => {
                  const active = type === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? 'bg-[#0F5C61] text-white border-[#0F5C61]'
                          : 'bg-[#FAF7F2] text-[#334155] border-[#E5DEC9] hover:border-[#0F5C61]/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What are your thoughts on this screen?"
                className="w-full rounded-xl border border-[#CBD5E1] bg-[#FAF7F2] px-3 py-2 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#0F5C61] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C61]/20"
              />

              <div className="flex items-center justify-end gap-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="cel-btn-primary text-xs px-3.5 py-2"
                >
                  {editingId ? 'Save changes' : 'Save note'}
                </button>
              </div>
            </form>

            {notes.length > 0 && (
              <div className="pt-3 border-t border-[#EFE9DC] space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Saved notes ({notes.length})
                </div>
                <ul className="space-y-2">
                  {notes.map((note) => {
                    const reaction = REACTIONS.find((r) => r.id === note.type);
                    return (
                      <li
                        key={note.id}
                        className="rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] p-2.5 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                                reaction?.badge ?? 'bg-[#F1F5F9] text-[#334155]'
                              }`}
                            >
                              {reaction?.label}
                            </span>
                            <span className="font-semibold text-[#072C2F] truncate">
                              {note.screen}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(note)}
                              aria-label="Edit note"
                              className="p-1 rounded text-[#64748B] hover:text-[#0F5C61] hover:bg-white cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(note.id)}
                              aria-label="Delete note"
                              className="p-1 rounded text-[#64748B] hover:text-[#B91C1C] hover:bg-white cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-[#1E293B] leading-relaxed">
                          {note.comment}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Copy All Footer */}
          <div className="px-4 py-3 border-t border-[#ECE4D6] bg-[#FAF7F2] shrink-0">
            <button
              type="button"
              disabled={notes.length === 0}
              onClick={handleCopyAll}
              className="cel-btn-lime w-full text-xs py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  Copied to clipboard
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy all feedback ({notes.length})
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#072C2F] text-white text-xs sm:text-sm font-semibold shadow-lg border border-[#167379] hover:bg-[#0F5C61] transition-colors cursor-pointer"
      >
        <MessageSquare className="w-4 h-4 text-[#84CC16]" />
        <span>Feedback</span>
        {notes.length > 0 && (
          <span className="px-1.5 py-0.5 rounded-full bg-[#84CC16] text-[#072C2F] text-[11px] font-extrabold leading-none">
            {notes.length}
          </span>
        )}
      </button>
    </>
  );
}
