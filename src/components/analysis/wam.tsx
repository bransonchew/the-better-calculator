'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useMemo } from 'react'
import { PRECISION } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import { useCourse } from '@/hooks/use-course'

const chartConfig = {
  wam: {
    label: 'WAM',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function WAM() {

  // Chart data
  const { metricsOverTime: data, metrics } = useCourse()

  // Data displays
  const theta = data.length > 1 ? metrics.wam - data[data.length - 2].wam : null
  const max = Math.max.apply(null, data.map(d => d.wam))

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
        className="flex flex-col items-stretch justify-between !p-0 sm:flex-row sm:border-b"
      >

        <div className="flex items-center px-6 pb-3 sm:pb-0">

          <div className="flex-1 flex flex-col justify-center gap-1">
            <CardTitle>Weighted Average Mark</CardTitle>
            <CardDescription>
              { data.length === 1
                ? `Since ${ fmt(data[0].date) }`
                : `${ fmt(data[0].date) } - ${ fmt(data[data.length - 1].date) }` }
            </CardDescription>
          </div>

          {/*Mobile*/ }
          <div className="flex flex-col gap-1 items-end sm:hidden">
            <div className="text-xl leading-none font-bold sm:text-3xl">
              { metrics.wam }
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2 leading-none">
              Latest
            </div>
          </div>

        </div>

        {/*Desktop*/ }
        <div
          className="hidden sm:flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
        >
          <span className="text-muted-foreground text-xs">
              Latest WAM
          </span>
          <span className="text-lg leading-none font-bold sm:text-3xl">
              { metrics.wam }
          </span>
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
              tickFormatter={ val => Number(val.toFixed(1)).toString() }
              domain={ ['auto', 'auto'] }
            />
            <defs>
              <linearGradient id="fillWAM" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-wam)"
                  stopOpacity={ 0.8 }
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-wam)"
                  stopOpacity={ 0.1 }
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="wam"
              type="linear"
              fill="url(#fillWAM)"
              fillOpacity={ 0.4 }
              stroke="var(--color-wam)"
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
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            { typeof theta === 'number'
              ? Math.abs(theta) > Math.pow(10, -PRECISION)
                ? theta > 0
                  ? (
                    <div className="flex items-center gap-2 leading-none font-medium">
                      Trending up { Number(theta.toFixed(PRECISION)) }% this semester
                      <TrendingUp className="h-4 w-4"/>
                    </div>
                  )
                  : (
                    <div className="flex items-center gap-2 leading-none font-medium">
                      Trending down { Number(theta.toFixed(PRECISION)) }% this semester
                      <TrendingDown className="h-4 w-4"/>
                    </div>
                  )
                : <p>Remain unchanged this semester</p>
              : <p>First semester recorded</p>
            }
            <div className="text-muted-foreground leading-none">
              Highest recorded at { Number(max.toFixed(PRECISION)) }
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
