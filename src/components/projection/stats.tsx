import { Card, CardContent, CardTitle } from '@/components/ui/card'
import HonoursBadge from '@/components/overview/honours-badge'
import { cn } from '@/lib/utils'
import { getHonours, Metrics } from '@/lib/calculations'

type StatsProps = {
  present: Metrics
  future: Metrics | null
}

export default function Stats({ present, future }: StatsProps) {
  return (
    <Card>
      <CardContent>
        <div className="grid gap-3 md:gap-0 md:grid-cols-2 md:divide-x">

          {/*Present*/ }
          <div className="grid gap-3 md:pr-6">
            <CardTitle className="text-center">Current</CardTitle>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center mt-0.5">
                <HonoursBadge honours={ getHonours(present.wam) }/>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-muted-foreground">
                  WAM
                </label>
                <span className="text-right font-mono">
                { present.wam }
                  </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-muted-foreground">
                  GPA
                </label>
                <span className="text-right font-mono">
                { present.gpa }
                  </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-muted-foreground">
                  CGPA
                </label>
                <span className="text-right font-mono">
                { present.cgpa }
                  </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-muted-foreground">
                  <span className="md:hidden lg:inline">Total Credit Points</span>
                  <span className="hidden md:inline lg:hidden">Total CP</span>
                </label>
                <span className="text-right font-mono">
                { present.totalCP }
                  </span>
              </div>
            </div>
          </div>

          {/*Future*/ }
          <div className="grid gap-3 md:pl-6">
            <CardTitle className="text-center">Projected</CardTitle>
            <div className="grid gap-2 text-sm">
              <div
                className={ cn(
                  'flex items-center justify-center mt-0.5',
                  !future && 'invisible',
                ) }
              >
                <HonoursBadge honours={ getHonours(future?.wam ?? 80) }/>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">
                  WAM
                </label>
                <span className="text-right font-mono">
                      { future?.wam ?? 'N/A' }
                    </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">
                  GPA
                </label>
                <span className="text-right font-mono">
                      { future?.gpa ?? 'N/A' }
                    </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">
                  CGPA
                </label>
                <span className="text-right font-mono">
                      { future?.cgpa ?? 'N/A' }
                    </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium">
                  <span className="md:hidden lg:inline">Total Credit Points</span>
                  <span className="hidden md:inline lg:hidden">Total CP</span>
                </label>
                <span className="text-right font-mono">
                      { future?.totalCP ?? 'N/A' }
                    </span>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
 