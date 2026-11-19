import type { HabitInfo } from '../types';

export const CORE_MOTTO =
  'A wise agent does not rush to reply. First, they understand.';

export const HABITS: HabitInfo[] = [
  {
    id: 'understand',
    number: 1,
    title: 'UNDERSTAND',
    label: 'Understand',
    shortDesc: 'Find the real need.',
    fullDesc:
      'What does the customer really need? Look past the words they use to their situation and expectations.',
    motto: 'Look beyond the question. Find the real need.',
  },
  {
    id: 'investigate',
    number: 2,
    title: 'INVESTIGATE',
    label: 'Investigate',
    shortDesc: 'Check before you answer.',
    fullDesc:
      'Check the project, domains, orders and history before replying. Do not answer blindly.',
    motto: 'Facts first. Answers second.',
  },
  {
    id: 'ownership',
    number: 3,
    title: 'TAKE OWNERSHIP',
    label: 'Take Ownership',
    shortDesc: 'Help find the next step.',
    fullDesc:
      'If you can investigate or help with the next step, do it. Do not send the customer elsewhere.',
    motto: 'Do not stop at what you cannot do. Find what you can do.',
  },
  {
    id: 'think-ahead',
    number: 4,
    title: 'THINK AHEAD',
    label: 'Think Ahead',
    shortDesc: 'Prevent avoidable confusion.',
    fullDesc:
      'Anticipate what else the customer will need to know and answer it before they ask.',
    motto: 'Think one step ahead. Help the customer move forward.',
  },
];

export const LESSON_INFO = {
  title: 'First Time Resolution',
  tagline: 'Understand the whole problem. Not just the question.',
  duration: 'About 5–7 minutes · Interactive lesson',
};
