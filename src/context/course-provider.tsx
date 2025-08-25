'use client'

import { createContext, ReactNode, SetStateAction, useMemo } from 'react'
import { RawUnit, unit, Unit } from '@/lib/schemas'
import { calcMetrics, calcMetricsOverTime, Metrics, MetricsOverTime } from '@/lib/calculations'
import { generateUUID } from '@/lib/utils'
import { useLocalStorage } from 'usehooks-ts'

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
}

export const CourseContext = createContext<Course>({
  units: [],
  metrics: {
    wam: 0, gpa: 0, cgpa: 0, totalCP: 0,
  },
  metricsOverTime: [],
  isEmpty: true,
  setUnits: () => {
  },
  insert: () => {
  },
  insertAt: () => {
  },
  update: () => {
  },
  remove: () => {
  },
  removeIds: () => {
  },
  clear: () => {
  },
})

export function CourseProvider({ children }: { children: ReactNode }) {

  // Client-side storage
  const [units, setData] = useLocalStorage<Unit[]>('units', [], {
    deserializer: value => {
      const arr = JSON.parse(value) as Unit[]

      // Reject non-arrays
      if (!Array.isArray(arr) || !arr.length) return []

      // Parse units & add UUID if none
      return arr.reduce<Unit[]>((acc, curr) => {
        const { success, data } = unit.safeParse(curr.id ? curr : {
          ...curr,
          id: generateUUID(),
        })

        // Reject invalid units
        if (success) acc.push(data)

        return acc
      }, [])
    },
  })
  const [lastUpdated, setLastUpdated] = useLocalStorage<number | undefined>('last-updated', undefined)

  // Flags
  const isEmpty = useMemo(() => units.length === 0, [units.length])

  // Update metrics
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

  return (
    <CourseContext.Provider
      value={ {
        units, setUnits,
        metrics, metricsOverTime, lastUpdated, isEmpty,
        insert, insertAt, update, remove, removeIds, clear,
      } }
    >
      { children }
    </CourseContext.Provider>
  )
}
