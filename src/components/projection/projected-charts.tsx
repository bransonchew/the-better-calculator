'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { BookOpen, TrendingDown, TrendingUp } from 'lucide-react'
import { Metrics } from '@/lib/calculations'

type FutureChartsProps = {
  present: Metrics
  future: Metrics | null
}

const wamChartConfig = {
  wam: {
    label: 'WAM',
  },
  present: {
    label: 'Current',
    color: 'var(--chart-1)',
  },
  future: {
    label: 'Projected',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

const gpaChartConfig = {
  gpa: {
    label: 'GPA',
  },
  present: {
    label: 'Current',
    color: 'var(--chart-2)',
  },
  future: {
    label: 'Projected',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export default function ProjectedCharts({ present, future }: FutureChartsProps) {

  if (!future) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Future Charts</CardTitle>
          <CardDescription>
            Current vs Projected Performance
          </CardDescription>
        </CardHeader>
        <CardContent className="grid place-content-center place-items-center gap-2 h-64 pb-6">
          <BookOpen className="w-12 h-12 text-muted-foreground"/>
          <p className="text-sm text-muted-foreground">
            Calculate from future units.
          </p>
        </CardContent>
      </Card>
    )
  }

  const wamChartData = [
    { period: 'present', wam: present.wam, fill: 'var(--color-present)' },
    { period: 'future', wam: future.wam, fill: 'var(--color-future)' },
  ]
  const gpaChartData = [
    { period: 'present', gpa: present.gpa, fill: 'var(--color-present)' },
    { period: 'future', gpa: future.gpa, fill: 'var(--color-future)' },
  ]

  const thetaW = future.wam - present.wam
  const thetaG = future.gpa - present.gpa

  return (
    <Card>
      <CardHeader>
        <CardTitle>Future Charts</CardTitle>
        <CardDescription>
          Current vs Projected Performance
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">

        {/*WAM*/ }
        <div className="grid gap-2.5">
          <h2 className="text-center font-semibold text-sm">
            WAM
          </h2>
          <ChartContainer config={ wamChartConfig }>
            <BarChart
              accessibilityLayer
              data={ wamChartData }
              margin={ { left: -12, right: 12 } }
            >
              <CartesianGrid vertical={ false }/>
              <XAxis
                dataKey="period"
                tickLine={ false }
                tickMargin={ 10 }
                axisLine={ false }
                tickFormatter={ (value) =>
                  wamChartConfig[value as keyof typeof wamChartConfig]?.label
                }
              />
              <YAxis
                tickLine={ false }
                axisLine={ false }
                tickMargin={ 8 }
                tickCount={ 3 }
                allowDecimals={ false }
                tickFormatter={ val => Number(val.toFixed(1)).toString() }
                domain={ ['dataMin - 1', 'auto'] }
              />
              <ChartTooltip
                content={ <ChartTooltipContent hideLabel/> }
              />
              <Bar dataKey="wam" barSize="25%"/>
            </BarChart>
          </ChartContainer>
        </div>

        {/*GPA*/ }
        <div className="grid gap-3">
          <h2 className="text-center font-semibold text-sm">
            GPA
          </h2>
          <ChartContainer config={ gpaChartConfig }>
            <BarChart
              accessibilityLayer
              data={ gpaChartData }
              margin={ { left: -12, right: 12 } }
            >
              <CartesianGrid vertical={ false }/>
              <XAxis
                dataKey="period"
                tickLine={ false }
                tickMargin={ 10 }
                axisLine={ false }
                tickFormatter={ (value) =>
                  gpaChartConfig[value as keyof typeof gpaChartConfig]?.label
                }
              />
              <YAxis
                tickLine={ false }
                axisLine={ false }
                tickMargin={ 8 }
                tickCount={ 3 }
                tickFormatter={ val => Number(val.toFixed(2)).toString() }
                domain={ ['dataMin - 0.005', 'auto'] }
              />
              <ChartTooltip
                content={ <ChartTooltipContent hideLabel/> }
              />
              <Bar dataKey="gpa" barSize="25%"/>
            </BarChart>
          </ChartContainer>
        </div>

      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-4 leading-none font-medium">
          WAM { thetaW >= 0 ? '↑' : '↓' } { Number(thetaW.toFixed(3)) }
          &nbsp;&nbsp;•&nbsp;
          GPA { thetaG >= 0 ? '↑' : '↓' } { Number(thetaG.toFixed(3)) }
          { (thetaW >= 0 || thetaG >= 0)
            ? <TrendingUp className="h-4 w-4"/>
            : <TrendingDown className="h-4 w-4"/> }
        </div>
        <div className="text-muted-foreground leading-none">
          Based on current grades and future units
        </div>
      </CardFooter>
    </Card>
  )
}
