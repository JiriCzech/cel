import type { LessonCase, ThinkAheadOption } from '../types';

export interface ReplyParagraph {
  key: string;
  text?: string;
  bullets?: string[];
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

/** Returns the sentences of the picked Think Ahead options in data order. */
export function thinkAheadBullets(
  options: ThinkAheadOption[],
  pickedIds: string[]
): string[] {
  return options
    .filter((o) => o.isCorrect && o.sentence && pickedIds.includes(o.id))
    .map((o) => o.sentence as string);
}

/**
 * Assembles the body paragraphs of the reply (without greeting / sign-off).
 * `texts` holds the chosen text per ownership step; missing steps are skipped.
 */
export function buildReplyParagraphs(
  lessonCase: LessonCase,
  texts: Record<string, string | undefined>,
  extra?: string | string[]
): ReplyParagraph[] {
  const result: ReplyParagraph[] = [];
  const hasExtra = Array.isArray(extra) ? extra.length > 0 : Boolean(extra);

  for (const step of lessonCase.ownership.steps) {
    if (hasExtra && step.id === lessonCase.thinkAhead.insertBeforeStep) {
      if (Array.isArray(extra)) {
        result.push({ key: 'think-ahead', bullets: extra });
      } else if (extra) {
        result.push({ key: 'think-ahead', text: extra });
      }
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
  const body = paragraphs.map((p) =>
    p.bullets && p.bullets.length > 0
      ? p.bullets.map((b) => `• ${b}`).join('\n')
      : p.text ?? ''
  );

  return [
    lessonCase.reply.greeting,
    ...body,
    `${lessonCase.reply.signOff}\n${agentName}\n${lessonCase.reply.team}`,
  ].join('\n\n');
}
