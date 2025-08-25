import Metrics from '@/components/overview/metric-cards'
import DataTable from '@/components/overview/data-table'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <div className="space-y-6">
      <Suspense fallback={ <Skeleton className="h-28"/> }>
        <Metrics/>
      </Suspense>
      <Suspense fallback={ <Skeleton className="h-60"/> }>
        <DataTable/>
      </Suspense>
    </div>
  )
}
