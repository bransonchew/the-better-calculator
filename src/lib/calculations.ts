import type { Unit } from '@/lib/schemas'
import { Grades, HonoursCourseGrades, PRECISION, Semesters } from '@/lib/constants'

export function getGrade(mark: number) {
  // Handle value errors
  if (mark < 0 || mark > 100) {
    throw new Error('Mark should be between 0 and 100 inclusive')
  }

  // Compute Grade
  if (mark >= 80) return Grades.HD
  if (mark >= 70) return Grades.D
  if (mark >= 60) return Grades.C
  if (mark >= 50) return Grades.P
  return Grades.N
}

export function getHonours(wam: number) {
  // Handle value errors
  if (wam < 0 || wam > 100) {
    throw new Error('WAM should be between 0 and 100 inclusive')
  }

  // Compute grade
  if (wam >= 80) return HonoursCourseGrades.H1
  if (wam >= 70) return HonoursCourseGrades.H2A
  if (wam >= 60) return HonoursCourseGrades.H2B
  return HonoursCourseGrades.P
}

export function getWeightedCreditPoints(code: string, creditPoint: number) {
  return Number(code[3]) > 1 ? creditPoint : creditPoint * 0.5
}

export function calcMetrics(units: Unit[]): Metrics {

  // Calculate total credit points
  const totalCP = units.reduce((sum, unit) => sum + unit.creditPoint, 0)

  // Calculate GPA
  const totalGP = units.reduce((sum, unit) => (
    sum + unit.creditPoint * getGrade(unit.mark).gpaValue
  ), 0)
  const gpa = totalCP > 0 ? totalGP / totalCP : 0

  // Calculate CGPA
  const totalCumulativeGP = units.reduce((sum, unit) => (
    sum + unit.creditPoint * getGrade(unit.mark).cgpaValue
  ), 0)
  const cgpa = totalCP > 0 ? totalCumulativeGP / totalCP : 0

  // Calculate total weighted credit points
  const totalWeightedCP = units.reduce((sum, unit) => (
    sum + getWeightedCreditPoints(unit.code, unit.creditPoint)
  ), 0)

  // Calculate WAM
  const totalWeightedMarks = units.reduce((sum, unit) => (
    sum + getWeightedCreditPoints(unit.code, unit.creditPoint) * unit.mark
  ), 0)
  const wam = totalWeightedCP > 0 ? totalWeightedMarks / totalWeightedCP : 0

  return {
    gpa: Number(gpa.toFixed(PRECISION)),
    cgpa: Number(cgpa.toFixed(PRECISION)),
    wam: Number(wam.toFixed(PRECISION)),
    totalCP,
  }
}

export function calcMetricsOverTime(units: Unit[]): MetricsOverTime {

  // Group by results publishing date
  const groups = new Map<number, Unit[]>()
  units.forEach(u => {
    const sem = Semesters[u.semester]
    const key = new Date(
      sem.forward ? u.year + 1 : u.year,  // Results publishing year
      sem.monthIndex,
    ).getTime()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(u)
  })

  // Sort groups by date
  const sortedGroups = groups.entries().toArray().toSorted((a, b) => a[0] - b[0])

  // Cumulative join
  const cumulativeGroups = sortedGroups.reduce((acc, [key, val], index) => {
    if (index > 0) {
      acc.push([key, acc[index - 1][1].concat(val)])
    } else {
      acc.push([key, val])
    }
    return acc
  }, [] as typeof sortedGroups)

  // Calculate metrics for each group
  return cumulativeGroups.map(([timestamp, units]) => ({
    ...calcMetrics(units),
    date: new Date(timestamp),
  }))
}

export type Metrics = {
  wam: number
  gpa: number
  cgpa: number
  totalCP: number
}

export type MetricsOverTime = (Metrics & {
  date: Date
})[]
