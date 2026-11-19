export type ScreenId =
  | 'meet-panda'
  | 'lab-hub'
  | 'lesson-intro'
  | 'game-1'
  | 'game-2'
  | 'game-3'
  | 'game-4'
  | 'reflection'
  | 'completion';

export type PandaPose =
  | 'welcome'
  | 'thinking'
  | 'explaining'
  | 'encouraging'
  | 'celebrating'
  | 'surprised';

export type HabitId =
  | 'understand'
  | 'investigate'
  | 'ownership'
  | 'think-ahead';

export interface HabitInfo {
  id: HabitId;
  number: number;
  title: string;
  label: string;
  shortDesc: string;
  fullDesc: string;
  motto: string;
}

/* ------------------------------------------------------------------ */
/*  Lesson case model                                                  */
/*  Everything scenario-specific lives in a single LessonCase object   */
/*  (see src/data/cases). Screens only render what they receive.       */
/* ------------------------------------------------------------------ */

export type Tone = 'ok' | 'warn' | 'info' | 'muted' | 'danger';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface QueueTicket {
  id: string;
  contactName: string;
  contactEmail: string;
  subject: string;
  state: string;
  stateTone: Tone;
  group: string;
  priority: TicketPriority;
  status: string;
  createdAgo: string;
  /** The ticket that opens the lesson. Exactly one per queue. */
  isLessonTicket?: boolean;
}

export interface CaseTicket {
  id: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  receivedAt: string;
}

/** Customer message: paragraphs made of text segments. Segments with a
 *  `clue` are highlighted only after the agent has answered. */
export type ClueKind = 'outcome' | 'situation';

export interface MessageSegment {
  text: string;
  clue?: ClueKind;
}

export interface ChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  /** One short sentence shown right after the option is picked. */
  feedback: string;
}

export interface UnderstandStep {
  prompt: string;
  question: string;
  options: ChoiceOption[];
  analysis: Record<ClueKind, { label: string; summary: string }>;
}

export type ToolCell = string | { text: string; tone: Tone };

export type ToolView =
  | {
      type: 'fields';
      fields: { label: string; value: ToolCell }[];
    }
  | {
      type: 'table';
      columns: string[];
      rows: ToolCell[][];
      note?: string;
    }
  | {
      type: 'log';
      entries: { time: string; text: string }[];
    };

export type ToolTabId =
  | 'project'
  | 'domains'
  | 'orders'
  | 'vouchers'
  | 'history';

export interface ToolTab {
  id: ToolTabId;
  label: string;
  view: ToolView;
  /** One-line fact unlocked in the Case Facts panel. */
  fact: { label: string; value: string; tone?: Tone };
}

export interface InvestigateStep {
  prompt: string;
  toolsContext: { projectId: string; projectUrl: string };
  tabs: ToolTab[];
  check: { question: string; options: ChoiceOption[] };
}

export interface ReplyStep {
  id: string;
  label: string;
  options: ChoiceOption[];
}

export interface OwnershipStep {
  prompt: string;
  steps: ReplyStep[];
}

export interface ThinkAheadOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  /** Sentence appended to the closing paragraph when picked (correct only). */
  sentence?: string;
}

export interface ThinkAheadStep {
  prompt: string;
  options: ThinkAheadOption[];
  /** Id of the reply step before which the new paragraph is inserted. */
  insertBeforeStep: string;
}

export interface ReplyMeta {
  greeting: string;
  signOff: string;
  team: string;
}

export interface LessonCase {
  id: string;
  /** Neutral label used on the landing card. Must not spoil the case. */
  teaser: string;
  /** Internal case title used in the final summary. */
  title: string;
  ticket: CaseTicket;
  queue: { prompt: string; viewName: string; tickets: QueueTicket[] };
  message: { paragraphs: MessageSegment[][]; signature: string };
  understand: UnderstandStep;
  investigate: InvestigateStep;
  reply: ReplyMeta;
  ownership: OwnershipStep;
  thinkAhead: ThinkAheadStep;
  reflection: {
    takeaways: Record<HabitId, string>;
    suggestions: string[];
  };
}
