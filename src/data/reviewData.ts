export type Metric = {
  value: number | null
  placeholder: string
  suffix?: string
  label: string
}

export const reviewData = {
  company: 'The Atom',
  person: {
    name: 'Hariharan S',
    role: 'Tech Lead',
    year: '2026',
  },
  roleResponsibilities: [
    'Managing campaign data and end to-end campaign execution',
    'Managing and integrating payment gateways and payment applications',
    'Maintaining The Atom website and server infrastructure',
    'Developing websites & softwares without any flaws',
    'Overseeing end-to-end technical project delivery',
  ],
  projects: [
    {
      name: 'TCJ Website',
      points: [
        'Developed the TCJ website',
        'Integrated online payment functionality',
        'Worked on end-to-end implementation',
      ],
    },
    {
      name: 'Elegant Interiors & Modular Kitchen',
      points: [
        'Designed and developed the website prototype',
        'Focused on modern UI/UX and product presentation',
      ],
    },
    {
      name: 'Dating / Matchstick Mobile App',
      points: [
        'Created the mobile app concept and prototype',
        'Worked on user flow, UI/UX and application structure',
      ],
    },
  ],
  firmValue: [
    'Converts ideas into working digital products',
    'Helps the firm establish a stronger digital presence',
    'Enables new business opportunities and services',
    'Reduces dependency on external development',
    'Speeds up prototyping and product validation',
    'Brings technology and business requirements together',
  ],
  improvementAreas: [
    'Improve project planning and estimation',
    'Improve documentation and technical processes',
    'Balance multiple projects more efficiently',
    'Improve prioritization between urgent and long-term work',
    'Spend more time on scalability and long-term architecture',
    'Improve mobile app development skills and technologies',
  ],
  improvementPlan: [
    'Follow a more structured development workflow',
    'Improve project estimation and prioritization',
    'Maintain better technical documentation',
    'Build reusable components and systems',
    'Improve testing and deployment processes',
    'Delegate where possible and focus more on technical direction',
  ],
  futureGoals: [
    'Lead larger technology initiatives',
    'Build scalable and maintainable systems',
    'Improve development standards across projects',
    'Increase automation and process efficiency',
    'Take greater ownership of product architecture',
    'Mentor and support the development team',
    "Contribute more directly to the firm's business growth",
  ],
  closing: 'My goal is not just to build applications, but to use technology to create solutions that make the firm faster, smarter and stronger.',
} as const

export const slidesMeta = [
  'Performance Review',
  'My Role',
  'Work Done',
  'What My Work Brings to the Firm',
  'Where I Can Be Better',
  'How I Plan to Improve',
  'Future Goals',
  'Closing',
] as const
