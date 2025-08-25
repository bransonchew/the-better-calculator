import * as z from 'zod/v4'

export const unit = z.object({
  id:          z.uuid(),
  code:        z.string('Enter unit code').trim().min(1, 'Enter unit code').regex(/^[A-Z]{3}\d{4}$/, 'Enter a valid unit code (e.g. FIT2000)'),
  name:        z.string('Enter unit name').trim().min(1, 'Enter unit name').max(80, 'Maximum 80 characters'),
  creditPoint: z.int('Enter an integer').min(0, 'Enter a positive integer').max(48, 'Enter an integer between 0 and 48'),
  mark:        z.int('Enter an integer').min(0, 'Enter a positive integer').max(100, 'Enter an integer between 0 and 100'),
  semester:    z.enum([
    'S1-01',
    'S2-01',
    'SSA-02',
    'SSB-01',
    'WS-01',
    'NOV12',
    'FY-01',
    'FY-32',
    'S2-32',
    'S2-SS-02',
    'SS-S1-01',
    'S1-60',
    'S1-32',
    'S2-60',
    'T1-57',
    'T2-57',
    'T4-57',
    'T1-58',
    'T2-58',
    'T3-58',
  ]),
  year:        z.int().nonnegative(),
})

export const rawUnit = unit.omit({ id: true })

export const futureUnit = unit.pick({
  code:        true,
  creditPoint: true,
  mark:        true,
})

export type Unit = z.infer<typeof unit>

export type RawUnit = z.infer<typeof rawUnit>

export type FutureUnit = z.infer<typeof futureUnit>
