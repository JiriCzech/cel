import type { LessonCase, ThinkAheadOption } from '../types';

export interface ReplyParagraph {
  key: string;
  text: string;
}

/** Text of the correct option for every ownership step, keyed by step id. */
export function correctReplyTexts(lessonCase: LessonCase): Record<string, string> {
  return Object.fromEntries(
    lessonCase.ownership.steps.map((step) => [
      step.id,
      step.options.find((o) => o.isCorrect)?.text ?? '',
    ])
  );
}

/** Joins the sentences of the picked Think Ahead options in data order. */
export function thinkAheadParagraph(
  options: ThinkAheadOption[],
  pickedIds: string[]
): string {
  return options
    .filter((o) => o.isCorrect && o.sentence && pickedIds.includes(o.id))
    .map((o) => o.sentence)
    .join(' ');
}

/**
 * Assembles the body paragraphs of the reply (without greeting / sign-off).
 * `texts` holds the chosen text per ownership step; missing steps are skipped.
 */
export function buildReplyParagraphs(
  lessonCase: LessonCase,
  texts: Record<string, string | undefined>,
  extraParagraph?: string
): ReplyParagraph[] {
  const result: ReplyParagraph[] = [];
  for (const step of lessonCase.ownership.steps) {
    if (extraParagraph && step.id === lessonCase.thinkAhead.insertBeforeStep) {
      result.push({ key: 'think-ahead', text: extraParagraph });
    }
    const text = texts[step.id];
    if (text) result.push({ key: step.id, text });
  }
  return result;
}

/** Full plain-text reply, e.g. for copying. */
export function replyToPlainText(
  lessonCase: LessonCase,
  paragraphs: ReplyParagraph[],
  agentName: string
): string {
  return [
    lessonCase.reply.greeting,
    ...paragraphs.map((p) => p.text),
    `${lessonCase.reply.signOff}\n${agentName}\n${lessonCase.reply.team}`,
  ].join('\n\n');
}
