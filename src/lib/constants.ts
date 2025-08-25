export const PRECISION = 3

export const Grades = {
  HD: {
    code: 'HD',
    title: 'High Distinction',
    gpaValue: 4,
    cgpaValue: 4,
  },
  D: {
    code: 'D',
    title: 'Distinction',
    gpaValue: 3,
    cgpaValue: 3.67,
  },
  C: {
    code: 'C',
    title: 'Credit',
    gpaValue: 2,
    cgpaValue: 2.85,
  },
  P: {
    code: 'P',
    title: 'Pass',
    gpaValue: 1,
    cgpaValue: 2.15,
  },
  N: {
    code: 'N',
    title: 'Fail',
    gpaValue: 0.3,
    cgpaValue: 1.15,
  },
  NH: {
    code: 'NH',
    title: 'Hurdle Fail',
    gpaValue: 0.3,
    cgpaValue: 1.15,
  },
  WN: {
    code: 'WN',
    title: 'Withdrawn Fail',
    gpaValue: 0,
    cgpaValue: 0,
  },
  // others
  DEF: {
    code: 'DEF',
    title: 'Deferred Assessment',
    gpaValue: 0,
    cgpaValue: 0,
  },
  NAS: {
    code: 'NAS',
    title: 'Not Assessed',
    gpaValue: 0,
    cgpaValue: 0,
  },
  NE: {
    code: 'NE',
    title: 'Not Examinable',
    gpaValue: 0,
    cgpaValue: 0,
  },
  NGO: {
    code: 'NGO',
    title: 'Fail',
    gpaValue: 0,
    cgpaValue: 0,
  },
  NS: {
    code: 'NS',
    title: 'Supplementary Assessment',
    gpaValue: 0,
    cgpaValue: 0,
  },
  NSR: {
    code: 'NSR',
    title: 'Not Satisfied Requirements',
    gpaValue: 0,
    cgpaValue: 0,
  },
  PGO: {
    code: 'PGO',
    title: 'Pass',
    gpaValue: 0,
    cgpaValue: 0,
  },
  SFR: {
    code: 'SFR',
    title: 'Satisfied Faculty Requirements',
    gpaValue: 0,
    cgpaValue: 0,
  },
  WDN: {
    code: 'WDN',
    title: 'Withdrawn',
    gpaValue: 0,
    cgpaValue: 0,
  },
  WH: {
    code: 'WH',
    title: 'Withheld',
    gpaValue: 0,
    cgpaValue: 0,
  },
  WI: {
    code: 'WI',
    title: 'Withdrawn Incomplete',
    gpaValue: 0,
    cgpaValue: 0,
  },
} as const

export const Semesters = {
  'SSA-02': {
    name: 'Summer semester A',
    monthIndex: 2,
    order: 0,
    forward: true,
  },
  'NOV12': {
    name: 'November intake',
    monthIndex: 2,
    order: 1,
    forward: true,
  },
  'SSB-01': {
    name: 'Summer semester B',
    monthIndex: 2,
    order: 2,
    forward: false,
  },
  'S2-SS-02': {
    name: 'Semester 2 - Summer A',
    monthIndex: 2,
    order: 3,
    forward: true,
  },
  'S1-60': {
    name: 'Semester 1 (Northern)',
    monthIndex: 2,
    order: 4,
    forward: true,
  },
  'T4-57': {
    name: 'Term 4',
    monthIndex: 2,
    order: 5,
    forward: true,
  },
  'T1-57': {
    name: 'Term 1',
    monthIndex: 4,
    order: 6,
    forward: false,
  },
  'T1-58': {
    name: 'Trimester 1',
    monthIndex: 4,
    order: 7,
    forward: false,
  },
  'S1-01': {
    name: 'Semester one',
    monthIndex: 6,
    order: 8,
    forward: false,
  },
  'S1-32': {
    name: 'Semester 1 (Extended)',
    monthIndex: 6,
    order: 9,
    forward: false,
  },
  'S2-60': {
    name: 'Semester 2 (Northern)',
    monthIndex: 6,
    order: 10,
    forward: false,
  },
  'SS-S1-01': {
    name: 'Summer A - Semester 1',
    monthIndex: 6,
    order: 11,
    forward: true,
  },
  'T2-57': {
    name: 'Term 2',
    monthIndex: 7,
    order: 12,
    forward: false,
  },
  'T2-58': {
    name: 'Trimester 2',
    monthIndex: 7,
    order: 13,
    forward: false,
  },
  'WS-01': {
    name: 'Winter semester',
    monthIndex: 7,
    order: 14,
    forward: false,
  },
  'S2-01': {
    name: 'Semester two',
    monthIndex: 11,
    order: 15,
    forward: false,
  },
  'FY-01': {
    name: 'Full-year',
    monthIndex: 11,
    order: 16,
    forward: false,
  },
  'FY-32': {
    name: 'Full-year (Extended)',
    monthIndex: 11,
    order: 17,
    forward: false,
  },
  'S2-32': {
    name: 'Semester 2 (Extended)',
    monthIndex: 11,
    order: 18,
    forward: false,
  },
  'T3-58': {
    name: 'Trimester 3',
    monthIndex: 11,
    order: 19,
    forward: false,
  },
} as const

export const HonoursCourseGrades = {
  H1: {
    code: 'H1',
    title: 'First Class Honours',
  },
  H2A: {
    code: 'H2A',
    title: 'Second Class Honours A',
  },
  H2B: {
    code: 'H2B',
    title: 'Second Class Honours B',
  },
  P: {
    code: 'P',
    title: 'Pass',
  },
  H3: {
    code: 'H3',
    title: 'Third Class Honours',  // Before 2021
  },
} as const

export type GradeCode = keyof typeof Grades

export type SemesterCode = keyof typeof Semesters

export type HonoursCode = keyof typeof HonoursCourseGrades

export type HonoursCourseGrade = typeof HonoursCourseGrades[HonoursCode]
