'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn, formatDate } from '@/lib/utils'
import { useCourse } from '@/hooks/use-course'

const chartConfig = {
  gpa: {
    label: 'GPA',
    color: 'var(--chart-1)',
  },
  cgpa: {
    label: 'CGPA',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function GPA() {

  // Chart data
  const { metricsOverTime: data, metrics } = useCourse()

  // Toggle show
  const [showCGPA, setShowCGPA] = useState(true)

  // X-Axis
  const ticks = useMemo(() => {
    const s = data[0].date
    if (data.length === 1) return [s.getTime()]
    const e = data[data.length - 1].date
    return [
      s.getTime(),
      ...Array.from(Array(e.getFullYear() - s.getFullYear()))
        .map((_, i) => new Date(s.getFullYear() + i + 1, 0).getTime()),
      e.getTime(),
    ]
  }, [data])

  // Convenience date formatter
  const fmt = (date: Date) => formatDate(date, { month: 'short', year: 'numeric' })

  return (
    <Card className="sm:pt-0">
      <CardHeader
        className={ cn(
          'flex flex-col items-stretch justify-between !p-0 sm:flex-row',
          showCGPA ? 'border-b' : 'sm:border-b',
        ) }
      >
        <div className="flex items-center px-6 pb-3 sm:pb-0">
          <div className="flex flex-1 flex-col justify-center gap-1">
            <CardTitle>Grade Point Average</CardTitle>
            <CardDescription>
              { data.length === 1
                ? `Since ${ fmt(data[0].date) }`
                : `${ fmt(data[0].date) } - ${ fmt(data[data.length - 1].date) }` }
            </CardDescription>
          </div>
          { !showCGPA && <div className="flex flex-col gap-1 items-end sm:hidden">
              <div className="text-xl leading-none font-bold sm:text-3xl">
                { metrics.gpa }
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 leading-none">
                  Latest
              </div>
          </div> }
        </div>
        <div className={ cn('flex', !showCGPA && 'hidden sm:flex') }>
          <div
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:flex-none sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
          >
            <span className="text-muted-foreground text-xs">
              Latest GPA
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              { metrics.gpa }
            </span>
          </div>
          <div
            className={ cn(
              'flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left border-l sm:flex-none sm:border-t-0 sm:border-l sm:px-8 sm:py-6',
              !showCGPA && 'hidden',
            ) }
          >
            <span className="text-muted-foreground text-xs">
              Latest CGPA
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              { metrics.cgpa }
            </span>
          </div
          >
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ chartConfig }>
          <AreaChart
            accessibilityLayer
            data={ data }
            margin={ { left: -12, right: 12 } }
          >
            <CartesianGrid vertical={ false }/>
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={ ['dataMin', 'dataMax'] }
              tickFormatter={ value => new Date(value).getFullYear().toString() }
              ticks={ ticks }
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
            />
            <YAxis
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              tickFormatter={ val => Number(val.toFixed(2)).toString() }
              domain={ ['auto', 'auto'] }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={ (_, payload) => {
                    if (!payload.length) return ''
                    const date = payload[0].payload.date
                    return fmt(date)
                  } }
                />
              }
            />
            { showCGPA && (
              <Area
                dataKey="cgpa"
                type="linear"
                fill="url(#fillCGPA)"
                fillOpacity={ 0.4 }
                stroke="var(--color-cgpa)"
              />
            ) }
            <Area
              dataKey="gpa"
              type="linear"
              fill="url(#fillGPA)"
              fillOpacity={ 0.4 }
              stroke="var(--color-gpa)"
            />
            <defs>
              <linearGradient id="fillCGPA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cgpa)"
                  stopOpacity={ 0.5 }
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cgpa)"
                  stopOpacity={ 0.1 }
                />
              </linearGradient>
              <linearGradient id="fillGPA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-gpa)"
                  stopOpacity={ 0.9 }
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-gpa)"
                  stopOpacity={ 0.1 }
                />
              </linearGradient>
            </defs>
            { showCGPA && <ChartLegend content={ <ChartLegendContent/> }/> }
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-end">
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-cgpa">Cumulative GPA</Label>
          <Switch
            id="show-cgpa"
            checked={ showCGPA }
            onCheckedChange={ checked => setShowCGPA(checked) }
          />
        </div>
      </CardFooter>
    </Card>
  )
}
