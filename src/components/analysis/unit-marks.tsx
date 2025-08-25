'use client'

import { ChevronDownIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCourse } from '@/hooks/use-course'

const chartConfig = {
  mark: {
    label: 'Mark',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function UnitMarks() {

  // Toggle show all units
  const [show, setShow] = useState(false)

  // Chart data
  const { units: data, metrics } = useCourse()
  const init = 8
  const chartData = [
    ...data, {
      code: 'WAM',
      name: 'Weighted Average Mark',
      year: 0,
      semester: 'FY-01',
      mark: metrics.wam,
      creditPoint: 0,
    },
  ].toSorted((a, b) => b.mark - a.mark).slice(0, show ? undefined : init)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Performance</CardTitle>
        <CardDescription>Highest to Lowest</CardDescription>
        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={ () => setShow(prev => !prev) }
            className={ cn(data.length < init && 'hidden') }
          >
            Show { show ? 'less' : 'all' }
            <ChevronDownIcon
              className={ cn('transition duration-300', show && 'rotate-180') }
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={ chartConfig }
          className={ cn(
            'aspect-auto h-[360px]',
            chartData.length > 8 && 'h-[480px]',
            chartData.length > 16 && 'h-[600px]',
            chartData.length > 24 && 'h-[840px]',
          ) }
        >
          <BarChart
            accessibilityLayer
            data={ chartData }
            layout="vertical"
            margin={ { left: 12 } }
          >
            <CartesianGrid horizontal={ false }/>
            <XAxis
              dataKey="mark"
              type="number"
              tickLine={ false }
              axisLine={ { strokeWidth: .1 } }
              tickMargin={ 12 }
              domain={ ([min, max]) => [
                Math.max(min % 10 ? min - min % 10 : min - 10, 0),
                Math.min(max - max % 10 + 10, 100),
              ] }
            />
            <YAxis
              dataKey="code"
              type="category"
              tickLine={ false }
              tickMargin={ 10 }
              axisLine={ false }
              minTickGap={ 1 }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="min-w-32"
                  formatter={ (value, name, item) => {
                    return (
                      <div className="flex gap-2 w-full">
                        <div
                          className="w-1 shrink-0 rounded-[2px] bg-(--color-bg)"
                          style={ {
                            '--color-bg': item.payload.code === 'WAM'
                              ? 'var(--chart-3)' : `var(--color-${ name })`,
                          } as React.CSSProperties }
                        />
                        <div className="grow flex flex-col gap-1">
                          <p>
                            { item.payload.name }
                          </p>
                          <div className="flex justify-between gap-1">
                            <p className="text-muted-foreground">
                              { item.payload.code }
                            </p>
                            <p className="font-mono">{ value }</p>
                          </div>
                        </div>
                      </div>
                    )
                  } }
                />
              }
            />
            <Bar dataKey="mark" fill="var(--color-mark)">
              { chartData.map((entry, index) => (
                <Cell
                  key={ `cell-${ index }` }
                  fill={
                    entry.code === 'WAM'
                      ? 'var(--chart-3)'
                      : 'var(--color-mark)'
                  }
                />
              )) }
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
