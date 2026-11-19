import type { LessonCase } from '../../types';

/**
 * Lesson case: Ticket #CARE-4821 – Alex Morgan
 * Topic: a customer paid for the wrong domain by mistake.
 *
 * To create a new lesson, copy this file, change the content and point
 * `ACTIVE_CASE` in src/data/index.ts to the new object. No UI changes needed.
 */
export const CASE_CARE_4821: LessonCase = {
  id: 'care-4821-wrong-domain',
  teaser: 'Real support scenario · Ticket #CARE-4821',
  title: 'The wrong domain',

  ticket: {
    id: 'CARE-4821',
    subject: 'Domain payment issue',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    receivedAt: 'Today, 09:42',
  },

  /* ---------------------------------------------------------------- */
  /*  Intro – ticket queue                                             */
  /* ---------------------------------------------------------------- */
  queue: {
    prompt: 'A new ticket just landed in your queue. Pick it up.',
    viewName: 'All unresolved tickets',
    tickets: [
      {
        id: 'CARE-4821',
        contactName: 'Alex Morgan',
        contactEmail: 'alex.morgan@example.com',
        subject: 'Domain payment issue',
        state: 'New',
        stateTone: 'ok',
        group: 'Support CZ',
        priority: 'High',
        status: 'Open',
        createdAgo: 'Just now',
        isLessonTicket: true,
      },
      {
        id: 'CARE-4819',
        contactName: 'Petra Novotná',
        contactEmail: 'petra.novotna@example.com',
        subject: 'Domain renewal for next year',
        state: 'Customer responded',
        stateTone: 'info',
        group: 'Support CZ',
        priority: 'Medium',
        status: 'Open',
        createdAgo: '25 min ago',
      },
      {
        id: 'CARE-4816',
        contactName: 'Martin Kovář',
        contactEmail: 'm.kovar@example.com',
        subject: "Can't log in to my account",
        state: 'In progress',
        stateTone: 'muted',
        group: 'Support CZ',
        priority: 'Urgent',
        status: 'Open',
        createdAgo: '1 h ago',
      },
      {
        id: 'CARE-4812',
        contactName: 'Lucie Dvořáková',
        contactEmail: 'lucie.d@example.com',
        subject: 'How do I change my account email?',
        state: 'Waiting on customer',
        stateTone: 'muted',
        group: 'Support CZ',
        priority: 'Low',
        status: 'Open',
        createdAgo: '2 h ago',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Customer message                                                 */
  /* ---------------------------------------------------------------- */
  message: {
    paragraphs: [
      [{ text: 'Hello,' }],
      [
        { text: 'I just paid for a domain, but something went wrong. ' },
        { text: 'I wanted alexmorgan.com', clue: 'outcome' },
        { text: ' for my portfolio site, but ' },
        { text: 'I ended up with designer-portfolio.net', clue: 'situation' },
        { text: ' instead. ' },
        { text: 'I thought that was the registration page', clue: 'situation' },
        { text: ' for my own domain, so I just clicked through and paid.' },
      ],
      [
        {
          text: "I don't want to pay for a domain I cannot use.",
          clue: 'outcome',
        },
        { text: ' What can I do now?' },
      ],
    ],
    signature: 'Thanks,\nAlex Morgan',
  },

  /* ---------------------------------------------------------------- */
  /*  1. Understand                                                    */
  /* ---------------------------------------------------------------- */
  understand: {
    prompt: "Read Alex's message calmly, then decide what they really need.",
    question: "What is the customer's real need?",
    options: [
      {
        id: 'connect',
        text: 'Help connecting designer-portfolio.net to the website.',
        isCorrect: false,
        feedback: "It's already connected – and Alex doesn't want it at all.",
      },
      {
        id: 'refund-only',
        text: 'A refund for designer-portfolio.net – nothing more.',
        isCorrect: false,
        feedback:
          "That's the request, not the goal: Alex would still have no address they want.",
      },
      {
        id: 'real-need',
        text: "Their website on alexmorgan.com, without paying for a domain they can't use.",
        isCorrect: true,
        feedback:
          'Exactly. The refund is the request – the right address is the real need.',
      },
      {
        id: 'explain-checkout',
        text: 'An explanation of how the domain checkout works.',
        isCorrect: false,
        feedback: "Alex isn't asking how it works – they want the mistake fixed.",
      },
    ],
    analysis: {
      outcome: {
        label: 'Desired outcome',
        summary:
          "A website on alexmorgan.com – and not paying for a domain Alex can't use.",
      },
      situation: {
        label: 'What happened',
        summary:
          'Alex mistook designer-portfolio.net for the registration step and paid for it.',
      },
    },
  },

  /* ---------------------------------------------------------------- */
  /*  2. Investigate                                                   */
  /* ---------------------------------------------------------------- */
  investigate: {
    prompt: 'Open every tab in Tools before you decide what to offer.',
    toolsContext: {
      projectId: '4821',
      projectUrl: 'alexmorgan.webnode.page',
    },
    tabs: [
      {
        id: 'project',
        label: 'Project',
        view: {
          type: 'fields',
          fields: [
            { label: 'Website', value: 'alexmorgan.webnode.page' },
            { label: 'Status', value: { text: 'Published', tone: 'ok' } },
            { label: 'Package', value: { text: 'Mini · annual', tone: 'info' } },
            { label: 'Package valid until', value: '12 Nov 2027' },
            { label: 'Main domain', value: 'designer-portfolio.net' },
            { label: 'Created', value: '12 Nov 2026' },
          ],
        },
        fact: { label: 'Package', value: 'Mini · active until 12 Nov 2027' },
      },
      {
        id: 'domains',
        label: 'Domains',
        view: {
          type: 'table',
          columns: ['Domain', 'Type', 'Status', 'Connected'],
          rows: [
            [
              'alexmorgan.webnode.page',
              'Webnode subdomain',
              { text: 'Active', tone: 'ok' },
              'Yes',
            ],
            [
              'designer-portfolio.net',
              'Registered · 1 year',
              { text: 'Active', tone: 'ok' },
              'Main domain',
            ],
          ],
          note: 'designer-portfolio.net registered today, expires 19 Nov 2027.',
        },
        fact: {
          label: 'Domain',
          value: 'designer-portfolio.net · main domain',
        },
      },
      {
        id: 'orders',
        label: 'Orders',
        view: {
          type: 'table',
          columns: ['Order', 'Item', 'Amount', 'Status'],
          rows: [
            [
              '#ORD-77342',
              'Domain designer-portfolio.net · 1 year',
              '€14.90',
              { text: 'Paid', tone: 'ok' },
            ],
            [
              '#ORD-77120',
              'Mini package · 1 year',
              '€48.00',
              { text: 'Paid', tone: 'ok' },
            ],
          ],
          note: '#ORD-77342: registered at the registry today 09:35 · non-refundable after registration · no voucher applied.',
        },
        fact: {
          label: 'Refund',
          value: 'Not possible · already registered',
          tone: 'warn',
        },
      },
      {
        id: 'vouchers',
        label: 'Vouchers',
        view: {
          type: 'table',
          columns: ['Voucher', 'Source', 'Status', 'Valid until'],
          rows: [
            [
              'Free domain · 1 year',
              'Mini package (#ORD-77120)',
              { text: 'Unused', tone: 'info' },
              '12 Nov 2027',
            ],
          ],
        },
        fact: {
          label: 'Voucher',
          value: '1-year free domain · unused',
          tone: 'ok',
        },
      },
      {
        id: 'history',
        label: 'History',
        view: {
          type: 'log',
          entries: [
            { time: '12 Nov, 14:05', text: 'Mini package purchased (#ORD-77120)' },
            { time: '12 Nov, 14:05', text: 'Voucher issued: free domain · 1 year' },
            { time: 'Today, 09:31', text: 'Domain search: alexmorgan.com' },
            { time: 'Today, 09:34', text: 'Order #ORD-77342 paid: designer-portfolio.net' },
            { time: 'Today, 09:35', text: 'designer-portfolio.net registered, set as main domain' },
            { time: 'Today, 09:42', text: 'Ticket #CARE-4821 created' },
          ],
        },
        fact: {
          label: 'alexmorgan.com',
          value: 'Searched, never ordered',
        },
      },
    ],
    check: {
      question: 'So what can you actually offer Alex?',
      options: [
        {
          id: 'refund',
          text: 'Refund designer-portfolio.net and register alexmorgan.com instead.',
          isCorrect: false,
          feedback: 'Orders shows the domain is already registered – no refund possible.',
        },
        {
          id: 'voucher',
          text: 'Register alexmorgan.com with the unused voucher and drop the unwanted domain.',
          isCorrect: true,
          feedback: "Right. The voucher turns a plain 'no refund' into a real solution.",
        },
        {
          id: 'rename',
          text: 'Rename designer-portfolio.net to alexmorgan.com.',
          isCorrect: false,
          feedback: "A registered domain can't be renamed – it's a different address.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  /*  3. Take Ownership – reply builder                                */
  /* ---------------------------------------------------------------- */
  reply: {
    greeting: 'Hi Alex,',
    signOff: 'Best regards,',
    team: 'Webnode Support',
  },

  ownership: {
    prompt: 'Build the reply paragraph by paragraph. Pick the version that owns the problem.',
    steps: [
      {
        id: 'acknowledge',
        label: 'Open the reply',
        options: [
          {
            id: 'generic',
            text: 'Thank you for contacting Webnode Support. We have received your request and will be happy to help.',
            isCorrect: false,
            feedback: 'Polite but generic – nothing shows you actually read the message.',
          },
          {
            id: 'own',
            text: "I'm sorry about the mix-up at checkout. I can see you meant to register alexmorgan.com, and designer-portfolio.net was ordered instead.",
            isCorrect: true,
            feedback: 'Naming the real problem tells Alex straight away that you understood.',
          },
          {
            id: 'blame',
            text: 'Please note that domain orders should always be double-checked before payment.',
            isCorrect: false,
            feedback: 'Even if true, it blames Alex and puts them on the defensive.',
          },
        ],
      },
      {
        id: 'limitation',
        label: 'Explain the limit',
        options: [
          {
            id: 'own',
            text: "Because designer-portfolio.net has already been registered with the domain registry, the registration can't be reversed, so unfortunately I can't refund it.",
            isCorrect: true,
            feedback: "Honest and explains why, so the 'no' doesn't feel arbitrary.",
          },
          {
            id: 'policy',
            text: 'Unfortunately, refunds are not possible per our policy.',
            isCorrect: false,
            feedback: 'A bare policy line explains nothing and closes the conversation.',
          },
          {
            id: 'false-hope',
            text: "I've asked our billing team whether they can make an exception and refund it.",
            isCorrect: false,
            feedback: 'False hope – Orders already shows the domain is non-refundable.',
          },
        ],
      },
      {
        id: 'offer',
        label: 'Offer what you can do',
        options: [
          {
            id: 'bank',
            text: "If you'd like to dispute the payment, please contact your bank.",
            isCorrect: false,
            feedback: 'It sends Alex away from a problem we can solve ourselves.',
          },
          {
            id: 'keep',
            text: 'designer-portfolio.net is actually a great address for a portfolio, so you could simply keep using it.',
            isCorrect: false,
            feedback: 'It ignores the outcome Alex asked for.',
          },
          {
            id: 'own',
            text: "Here's what I can do: your Mini package includes a free 1-year domain voucher you haven't used yet, so you can register alexmorgan.com at no extra cost.",
            isCorrect: true,
            feedback: 'That is ownership – you found a real way to get Alex what they wanted.',
          },
        ],
      },
      {
        id: 'close',
        label: 'Close the loop',
        options: [
          {
            id: 'generic',
            text: 'Let me know if you have any other questions.',
            isCorrect: false,
            feedback: 'Standard, but it leaves Alex to work out what happens next.',
          },
          {
            id: 'own',
            text: "If anything is unclear, just reply to this email – I'll keep an eye on your ticket until alexmorgan.com is live.",
            isCorrect: true,
            feedback: 'You stay with Alex until the problem is actually solved.',
          },
          {
            id: 'kb',
            text: 'For more information, please visit our Knowledge Base.',
            isCorrect: false,
            feedback: 'It sends Alex off to search alone instead of finishing the job.',
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  4. Think Ahead                                                   */
  /* ---------------------------------------------------------------- */
  thinkAhead: {
    prompt: 'What will Alex ask next? Pick the 3 points that answer it in this reply.',
    insertBeforeStep: 'close',
    options: [
      {
        id: 'voucher-howto',
        text: 'Explain exactly how to apply the voucher in the administration',
        isCorrect: true,
        feedback: "Otherwise Alex writes back asking 'where do I use it?'",
        sentence:
          'To use the voucher, open your website administration, go to Domains, search for alexmorgan.com and choose the voucher as the payment method at checkout.',
      },
      {
        id: 'promise-available',
        text: 'Reassure Alex that alexmorgan.com is definitely still available',
        isCorrect: false,
        feedback: 'Nobody has verified that yet – a promise like this can backfire.',
      },
      {
        id: 'disconnect',
        text: 'Confirm that the unwanted domain will be disconnected from the project',
        isCorrect: true,
        feedback: "Answers 'what happens to the domain I didn't want?' before Alex asks.",
        sentence:
          'Once it is registered, I will disconnect designer-portfolio.net from your project and set alexmorgan.com as your main domain.',
      },
      {
        id: 'dns',
        text: 'Explain how to set up DNS records for the new domain',
        isCorrect: false,
        feedback: 'A domain registered through Webnode connects automatically – DNS talk would only confuse.',
      },
      {
        id: 'renewal',
        text: 'Mention that the voucher covers the first year only',
        isCorrect: true,
        feedback: 'No surprise invoice in twelve months – that is thinking ahead.',
        sentence:
          'The voucher covers the first year; after that, the domain renews at the standard price and we will remind you beforehand.',
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Reflection                                                       */
  /* ---------------------------------------------------------------- */
  reflection: {
    takeaways: {
      understand:
        'Alex asked for a refund, but the real need was a website on alexmorgan.com.',
      investigate:
        'Tools showed the domain was non-refundable – and an unused 1-year voucher in the Mini package.',
      ownership:
        "Instead of a bare 'no refund', you offered a free way to get alexmorgan.com.",
      'think-ahead':
        'You covered the voucher, the disconnect and the renewal, so Alex has no reason to write back.',
    },
    suggestions: [
      'Check Orders and Vouchers before I say no',
      'Ask what the customer is really trying to achieve',
      'End every reply with a clear next step',
    ],
  },
};
