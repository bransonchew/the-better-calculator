import Projection from '@/components/projection'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  description: 'Plan ahead by adding future units and projecting your GPA and WAM outcomes.',
}

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Projection</h1>
        <p className="text-muted-foreground mt-1">
          See how future units affect your WAM and GPA.
        </p>
      </div>
      <Suspense fallback={ <Skeleton className="h-72"/> }>
        <Projection/>
      </Suspense>
    </div>
  )
}
