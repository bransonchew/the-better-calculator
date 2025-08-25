import { Metadata } from 'next'
import Analysis from '@/components/analysis'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  description: 'Dive into interactive charts to explore performance trends with clear insights.',
}

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Results</h1>
        <p className="text-muted-foreground mt-1">
          Visualize your academic progress over time.
        </p>
      </div>
      <Suspense fallback={ <Skeleton className="h-72"/> }>
        <Analysis/>
      </Suspense>
    </div>
  )
}
