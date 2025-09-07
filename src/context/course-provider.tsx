'use client'

import { createContext, ReactNode, SetStateAction, useMemo } from 'react'
import { RawUnit, unit, Unit } from '@/lib/schemas'
import { calcMetrics, calcMetricsOverTime, Metrics, MetricsOverTime } from '@/lib/calculations'
import { generateUUID } from '@/lib/utils'
import { useLocalStorage } from 'usehooks-ts'
import Papa from 'papaparse'

const noop = () => {
  // No operation
}

type Course = {
  units: Unit[],
  metrics: Metrics,
  metricsOverTime: MetricsOverTime,
  lastUpdated?: number,
  isEmpty: boolean,
  setUnits: (action: SetStateAction<Unit[]>) => void,
  insert: (units: RawUnit) => void,
  insertAt: (unit: Unit, index: number) => void,
  update: (unit: Unit) => void,
  remove: (id: string) => void,
  removeIds: (ids: string[]) => void,
  clear: () => void,
  toJSON: () => string,
  toCSV: () => string,
}

export const CourseContext = createContext<Course>({
  units: [],
  metrics: { wam: 0, gpa: 0, cgpa: 0, totalCP: 0 },
  metricsOverTime: [],
  isEmpty: true,
  setUnits: noop,
  insert: noop,
  insertAt: noop,
  update: noop,
  remove: noop,
  removeIds: noop,
  clear: noop,
  toJSON: () => '',
  toCSV: () => '',
})

export const preprocess = (arr: Unit[]) => {
  // Reject non-arrays
  if (!Array.isArray(arr) || !arr.length) return []

  // Parse units & add UUID if none
  return arr.reduce<Unit[]>((acc, curr) => {
    const { success, data } = unit.safeParse(curr.id ? curr : {
      ...curr,
      id: generateUUID(),
    })
    if (success) acc.push(data)  // Reject invalid units
    return acc
  }, [])
}

export function CourseProvider({ children }: { children: ReactNode }) {

  // Client-side storage
  const [units, setData] = useLocalStorage<Unit[]>('units', [], {
    deserializer: value => preprocess(JSON.parse(value) as Unit[]),
  })
  const [lastUpdated, setLastUpdated] = useLocalStorage<number | undefined>('last-updated', undefined)

  // Flag
  const isEmpty = useMemo(() => units.length === 0, [units.length])

  // Academic metrics
  const { metrics, metricsOverTime } = useMemo(() => ({
    metrics: calcMetrics(units),
    metricsOverTime: calcMetricsOverTime(units),
  }), [units])

  // Track last updated time
  const setUnits = (f: SetStateAction<Unit[]>) => {
    setData(f)
    setLastUpdated(new Date().getTime())
  }

  const insert = (unit: RawUnit) => {
    setUnits(prev => [{ ...unit, id: generateUUID() }, ...prev])
  }

  const insertAt = (unit: Unit, index: number) => {
    setUnits(prev => {
      // Avoid duplication during renders
      if (prev[index] && prev[index].id === unit.id) return prev
      return prev.toSpliced(index, 0, unit)
    })
  }

  const update = (unit: Unit) => {
    setUnits(prev => prev.map(u => u.id === unit.id ? { ...u, ...unit } : u))
  }

  const remove = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id))
  }

  const removeIds = (ids: string[]) => {
    const set = new Set(ids)
    setUnits(prev => prev.filter(u => !set.has(u.id)))
  }

  const clear = () => {
    setUnits(() => [])
  }

  const toJSON = () => JSON.stringify(units, (key, value) => (
    key === 'id' ? undefined : value
  ), 2)

  const toCSV = () => Papa.unparse(units, {
    header: true,
    skipEmptyLines: true,
    columns: ['code', 'name', 'creditPoint', 'mark', 'semester', 'year'],
  })

  return (
    <CourseContext.Provider
      value={ {
        units, setUnits,
        metrics, metricsOverTime, lastUpdated, isEmpty,
        insert, insertAt, update, remove, removeIds, clear,
        toJSON, toCSV,
      } }
    >
      { children }
    </CourseContext.Provider>
  )
}
