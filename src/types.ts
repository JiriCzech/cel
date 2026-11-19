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
  shortDesc: string;
  fullDesc: string;
  motto: string;
}

export interface TicketClue {
  id: string;
  phrase: string;
  label: string;
  insight: string;
}

export interface ToolTab {
  id: 'project' | 'domains' | 'orders' | 'vouchers' | 'history';
  label: string;
  subtitle: string;
  fields: { label: string; value: string; highlight?: boolean }[];
  clueTitle: string;
  clueSummary: string;
}

export interface EmailPart {
  id: string;
  label: string;
  text: string;
  why: string;
}
