'use client'

import React, { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { getGrade } from '@/lib/calculations'
import { Grades } from '@/lib/constants'
import { useCourse } from '@/hooks/use-course'

const chartConfig = {
  count: {
    label: 'Count',
  },
  [Grades.HD.code]: {
    label: Grades.HD.title,
    color: 'var(--chart-1)',
  },
  [Grades.D.code]: {
    label: Grades.D.title,
    color: 'var(--chart-2)',
  },
  [Grades.C.code]: {
    label: Grades.C.title,
    color: 'var(--chart-3)',
  },
  [Grades.P.code]: {
    label: Grades.P.title,
    color: 'var(--chart-4)',
  },
  [Grades.N.code]: {
    label: Grades.N.title,
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export default function GradeDist() {

  // Chart data
  const { units: data } = useCourse()
  const chartData = useMemo(() => {

    // Count units per grade
    const grades = data.reduce((acc, curr) => {
      acc[getGrade(curr.mark).code]++
      return acc
    }, {
      [Grades.HD.code]: 0,
      [Grades.D.code]: 0,
      [Grades.C.code]: 0,
      [Grades.P.code]: 0,
      [Grades.N.code]: 0,
    })

    // Construct data
    return Object.entries(grades).map(([grade, count]) => ({
      grade,
      count,
      rate: count / data.length,
      fill: `var(--color-${ grade })`,
    }))
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Number of Units per Grade</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={ chartConfig }
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={ false }
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={ (value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={ {
                          '--color-bg': `var(--color-${ name })`,
                        } as React.CSSProperties }
                      />
                      { chartConfig[name as keyof typeof chartConfig]?.label ||
                        name }
                      <div
                        className="text-foreground ml-auto flex items-baseline gap-1 font-mono font-medium tabular-nums">
                        { value }
                        <span className="text-muted-foreground font-normal">
                          { Math.round(item.payload.rate * 100) }%
                        </span>
                      </div>
                    </>
                  ) }
                />
              }
            />
            <Pie
              data={ chartData }
              dataKey="count"
              nameKey="grade"
              innerRadius={ 75 }
              strokeWidth={ 5 }
            >
              <Label
                content={ ({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={ viewBox.cx }
                        y={ viewBox.cy }
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={ viewBox.cx }
                          y={ viewBox.cy }
                          className="fill-foreground text-4xl font-bold"
                        >
                          { data.length }
                        </tspan>
                        <tspan
                          x={ viewBox.cx }
                          y={ (viewBox.cy || 0) + 24 }
                          className="fill-muted-foreground"
                        >
                          Units Completed
                        </tspan>
                      </text>
                    )
                  }
                } }
              />
            </Pie>
            <ChartLegend
              content={ <ChartLegendContent nameKey="grade"/> }
              className="grid grid-cols-3 justify-items-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
