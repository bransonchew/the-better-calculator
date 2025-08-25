'use client'

import FutureUnits from '@/components/projection/future-units'
import { useMemo } from 'react'
import { Metrics, calcMetrics } from '@/lib/calculations'
import ProjectedCharts from '@/components/projection/projected-charts'
import { useCourse } from '@/hooks/use-course'
import { useFutureUnits } from '@/hooks/use-future-units'
import Stats from '@/components/projection/stats'
import NoUnits from '@/components/no-units'

export default function Projection() {

  const { units, metrics, isEmpty } = useCourse()

  const [futureUnits, setFutureUnits] = useFutureUnits()

  const futureMetrics = useMemo<Metrics | null>(() => (
    futureUnits.length
      ? calcMetrics(units.concat(
        futureUnits.map(u => ({
          ...u,
          id: '',
          name: '',
          semester: 'S2-01',
          year: new Date().getFullYear(),
        })),
      ))
      : null
  ), [units, futureUnits])

  if (isEmpty) {
    return (
      <div className="border rounded-2xl">
        <NoUnits/>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-12 gap-5">

      <div className="md:col-span-7 grid gap-5">
        <Stats present={ metrics } future={ futureMetrics }/>
        <FutureUnits
          defaultValues={ futureUnits }
          setFutureUnitsAction={ setFutureUnits }
        />
      </div>

      <div className="md:col-span-5 self-stretch">
        <ProjectedCharts present={ metrics } future={ futureMetrics }/>
      </div>

    </div>
  )
}
