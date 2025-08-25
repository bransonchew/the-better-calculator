'use client'

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useCourse } from '@/hooks/use-course'
import { getHonours } from '@/lib/calculations'
import HonoursBadge from '@/components/overview/honours-badge'
import {
  Book,
  ChartColumnIncreasing,
  EqualApproximately,
  GraduationCap,
  Layers,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PRECISION } from '@/lib/constants'

export default function MetricCards() {

  const { units, metrics, metricsOverTime, isEmpty } = useCourse()

  // Data displays
  const { gpa: g = 0, wam: w = 0 } = metricsOverTime[metricsOverTime.length - 2] ?? {}
  const thetaG = Number((metrics.gpa - g).toFixed(PRECISION))
  const thetaW = Number((metrics.wam - w).toFixed(PRECISION))
  const maxG = metricsOverTime.reduce((acc, curr) => (
    Math.max(acc, curr.gpa)
  ), -Infinity)
  const maxW = metricsOverTime.reduce((acc, curr) => (
    Math.max(acc, curr.wam)
  ), -Infinity)
  const honours = getHonours(metrics.wam)

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
      *:data-[slot=card]:gap-3 *:data-[slot=card]:py-5
      *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs"
    >

      {/* GPA */ }
      <Card>
        <CardHeader>
          <CardDescription>Grade Point Average</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            { metrics.gpa }
          </CardTitle>
          <CardAction>
            <GraduationCap className="text-muted-foreground size-5"/>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Badge variant="secondary" className="-ml-2">
            { isEmpty
              ?
              <>No unit record <Book className="h-4 w-4"/></>
              :
              metricsOverTime.length === 0 || metrics.gpa === maxG
                ?
                <>Highest GPA record <Star className="h-4 w-4"/></>
                :
                thetaG > 0
                  ?
                  <>Trending up this semester<TrendingUp className="h-4 w-4"/></>
                  :
                  thetaG < 0
                    ?
                    <>Trending down this semester<TrendingDown className="h-4 w-4"/></>
                    :
                    <>Stable performance <EqualApproximately className="h-4 w-4"/></> }
          </Badge>
        </CardFooter>
      </Card>

      {/* WAM */ }
      <Card>
        <CardHeader>
          <CardDescription>Weighted Average Mark</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            { metrics.wam }
          </CardTitle>
          <CardAction>
            <ChartColumnIncreasing className="text-muted-foreground size-4"/>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Badge variant="secondary" className="-ml-2">
            { isEmpty
              ?
              <>No unit record <Book className="h-4 w-4"/></>
              :
              metricsOverTime.length === 0 || metrics.wam === maxW
                ?
                <>Highest WAM record <Star className="h-4 w-4"/></>
                :
                thetaW > 0
                  ?
                  <>Trending up this semester<TrendingUp className="h-4 w-4"/></>
                  :
                  thetaW < 0
                    ?
                    <>Trending down this semester<TrendingDown className="h-4 w-4"/></>
                    :
                    <>Stable performance <EqualApproximately className="h-4 w-4"/></> }
          </Badge>
        </CardFooter>
      </Card>

      {/* Credit Points */ }
      <Card>
        <CardHeader>
          <CardDescription>Total Credit Points</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            { metrics.totalCP }
          </CardTitle>
          <CardAction>
            <Layers className="text-muted-foreground size-4"/>
          </CardAction>
        </CardHeader>
        <CardFooter>
          <Badge variant="secondary" className="-ml-2">
            { units.length } units completed
          </Badge>
        </CardFooter>
      </Card>

      {/* Honours */ }
      <Card>
        <CardHeader>
          <CardDescription>Honours Course Grade</CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            { honours.code }
          </CardTitle>
          <CardAction>
            <Trophy className="text-muted-foreground size-4"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="-ml-2 font-medium">
          <HonoursBadge honours={ honours }/>
        </CardFooter>
      </Card>

    </div>
  )
}
