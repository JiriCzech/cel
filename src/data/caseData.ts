import type { EmailPart, HabitInfo, TicketClue, ToolTab } from '../types';

export const CORE_MOTTO =
  'A wise agent does not rush to reply. First, they understand.';

export const HABITS: HabitInfo[] = [
  {
    id: 'understand',
    number: 1,
    title: 'UNDERSTAND',
    shortDesc: 'Find the real need.',
    fullDesc:
      'What does the customer really need? Do not focus only on the words they use. Understand their situation, expectations and frustration.',
    motto: 'Look beyond the question. Find the real need.',
  },
  {
    id: 'investigate',
    number: 2,
    title: 'INVESTIGATE',
    shortDesc: 'Check before you answer.',
    fullDesc:
      'Check the available information before replying. Look at the project, domain, order, account and relevant history. Do not answer blindly.',
    motto: 'Facts first. Answers second.',
  },
  {
    id: 'ownership',
    number: 3,
    title: 'TAKE OWNERSHIP',
    shortDesc: 'Help find the next step.',
    fullDesc:
      'If you can investigate or help with the next step, do it. Do not unnecessarily send the customer elsewhere.',
    motto: 'Do not stop at what you cannot do. Find what you can do.',
  },
  {
    id: 'think-ahead',
    number: 4,
    title: 'THINK AHEAD',
    shortDesc: 'Prevent avoidable confusion.',
    fullDesc:
      'Anticipate what else the customer may need to know. Explain the next steps clearly and prevent avoidable confusion.',
    motto: 'Think one step ahead. Help the customer move forward.',
  },
];

export const CASE_META = {
  ticketId: 'CARE-4821',
  subject: 'Wrong domain paid by mistake',
  customerName: 'Alex Morgan',
  customerEmail: 'alex.morgan@example.com',
  receivedAt: 'Today, 09:42',
  intendedDomain: 'alexmorgan.com',
  purchasedDomain: 'designer-portfolio.net',
  projectAddress: 'alexmorgan.webnode.page',
};

export const TICKET_CLUES: TicketClue[] = [
  {
    id: 'wanted-domain',
    phrase: 'I wanted alexmorgan.com',
    label: 'Desired outcome',
    insight:
      'The customer has a specific desired outcome: they want their website at alexmorgan.com.',
  },
  {
    id: 'thought-page',
    phrase: 'I thought that was the registration page',
    label: 'Flow misunderstanding',
    insight:
      'There was a misunderstanding during the purchase. They believed designer-portfolio.net was a link or step leading to registering their own desired domain.',
  },
  {
    id: 'cannot-use',
    phrase: "I don't want to pay for a domain I cannot use",
    label: 'Core frustration',
    insight:
      'The customer is concerned about paying for something useless for their website rather than getting the domain they intended.',
  },
];

export const REAL_NEED_OPTIONS = [
  {
    id: 'A',
    text: 'They want instructions for connecting a domain.',
    isCorrect: false,
  },
  {
    id: 'B',
    text: 'They want a refund and a way to get the domain they originally intended to register.',
    isCorrect: true,
  },
  {
    id: 'C',
    text: 'They want to register several domains.',
    isCorrect: false,
  },
];

export const TOOL_TABS: ToolTab[] = [
  {
    id: 'project',
    label: 'Project',
    subtitle: 'Site overview & configuration',
    fields: [
      { label: 'Website', value: 'alexmorgan.webnode.page', highlight: true },
      { label: 'Goal noted', value: 'Customer wants a custom domain.' },
    ],
    clueTitle: 'Project target',
    clueSummary:
      'Website alexmorgan.webnode.page needs a custom domain.',
  },
  {
    id: 'domains',
    label: 'Domains',
    subtitle: 'Registered & connected domains',
    fields: [
      {
        label: 'Domain name',
        value: 'designer-portfolio.net',
        highlight: true,
      },
      { label: 'Status', value: 'Registered' },
      { label: 'Assignment', value: 'Connected as the main domain.' },
    ],
    clueTitle: 'Domain status',
    clueSummary:
      'designer-portfolio.net is already registered and connected as the main domain.',
  },
  {
    id: 'orders',
    label: 'Orders',
    subtitle: 'Payment & registration status',
    fields: [
      {
        label: 'Order state',
        value: 'Domain registration was completed.',
        highlight: true,
      },
      {
        label: 'Refund eligibility',
        value:
          'A completed registration cannot be reversed for a refund in this case.',
      },
    ],
    clueTitle: 'Order constraint',
    clueSummary:
      'Registration is completed and cannot be reversed for a refund in this case.',
  },
  {
    id: 'vouchers',
    label: 'Vouchers',
    subtitle: 'Promotional & included credits',
    fields: [
      {
        label: 'Available voucher',
        value:
          'An eligible domain voucher was included with the customer’s Premium purchase.',
        highlight: true,
      },
      {
        label: 'Validity',
        value: 'It can be used for one year on an eligible domain.',
      },
    ],
    clueTitle: 'Available voucher',
    clueSummary:
      'Customer has an eligible 1-year domain voucher from their Premium purchase.',
  },
  {
    id: 'history',
    label: 'History',
    subtitle: 'Customer context & notes',
    fields: [
      {
        label: 'Original intent',
        value: 'The customer originally wanted alexmorgan.com.',
        highlight: true,
      },
      {
        label: 'Context',
        value: 'The customer misunderstood the domain registration flow.',
      },
    ],
    clueTitle: 'Purchase context',
    clueSummary:
      'Customer originally wanted alexmorgan.com and misunderstood the registration flow.',
  },
];

export const INVESTIGATION_FINDINGS = [
  {
    id: 'registered',
    text: 'The unwanted domain has already been registered.',
    isCorrect: true,
  },
  {
    id: 'no-refund',
    text: 'The registration cannot be refunded in this case.',
    isCorrect: true,
  },
  {
    id: 'voucher',
    text: 'There is an available domain voucher.',
    isCorrect: true,
  },
  {
    id: 'correct-process',
    text: 'The customer must register the intended domain using the correct registration process.',
    isCorrect: true,
  },
  {
    id: 'reverse-auto',
    text: 'The completed domain registration can be reversed and refunded automatically.',
    isCorrect: false,
  },
  {
    id: 'rename-domain',
    text: 'We can rename designer-portfolio.net directly to alexmorgan.com.',
    isCorrect: false,
  },
];

export const RESPONSE_OPTIONS = [
  {
    id: 'A',
    title: 'Option A – The quick refusal',
    text: 'Unfortunately, the domain is already registered and cannot be refunded. Please register another domain.',
    isCorrect: false,
    feedback:
      'Not quite. This states the limitation, but it leaves the customer stuck with an unwanted connected domain and gives them no real path forward.',
  },
  {
    id: 'B',
    title: 'Option B – The redirect',
    text: 'Please contact the domain registrar for further assistance.',
    isCorrect: false,
    feedback:
      'Careful. Sending the customer away when we already have the tools and voucher information inside Webnode creates unnecessary frustration.',
  },
  {
    id: 'C',
    title: 'Option C – Take ownership',
    text: "I'm sorry for the confusion. The domain has already been registered, so we cannot reverse the registration or issue a refund in this case. However, I can help you move forward: we can disconnect the unwanted domain, and you can use your available domain voucher to register your intended domain for one year.",
    isCorrect: true,
    feedback:
      'Exactly. We cannot always give customers the outcome they originally wanted. But we can still help them find the best available solution.',
  },
];

export const EMAIL_ANATOMY_PARTS: EmailPart[] = [
  {
    id: 'acknowledge',
    label: '1. Acknowledge the confusion',
    text: "I'm sorry for the confusion.",
    why: 'Starts with empathy and shows the customer you understood that the flow felt misleading, without blaming them.',
  },
  {
    id: 'limitation',
    label: '2. Explain the limitation',
    text: 'The domain has already been registered, so we cannot reverse the registration or issue a refund in this case.',
    why: 'Sets clear, honest boundaries based on verified facts—never promising what cannot be done.',
  },
  {
    id: 'alternative',
    label: '3. Offer a concrete alternative',
    text: 'However, I can help you move forward: we can disconnect the unwanted domain,',
    why: 'Takes ownership of what we can control—offering to cancel the unwanted domain and disconnect it from the project and Webnode system.',
  },
  {
    id: 'next-step',
    label: '4. Explain what happens next',
    text: 'and you can use your available domain voucher to register your intended domain for one year.',
    why: 'Connects the available voucher directly to the customer’s real goal: getting their intended website address.',
  },
];

export const THINK_AHEAD_OPTIONS = [
  {
    id: 'why-no-refund',
    text: 'Why a refund is not possible.',
    isCorrect: true,
  },
  {
    id: 'can-disconnect',
    text: 'Whether the unwanted domain can be disconnected.',
    isCorrect: true,
  },
  {
    id: 'how-voucher',
    text: 'How to use the voucher.',
    isCorrect: true,
  },
  {
    id: 'where-register',
    text: 'Where to find the domain registration process.',
    isCorrect: true,
  },
  {
    id: 'eligible-domains',
    text: 'Which domains are eligible for the voucher.',
    isCorrect: true,
  },
  {
    id: 'guaranteed-available',
    text: 'That the new domain is guaranteed to be available.',
    isCorrect: false,
  },
  {
    id: 'unrelated-hosting',
    text: 'A long explanation of unrelated hosting features.',
    isCorrect: false,
  },
];
