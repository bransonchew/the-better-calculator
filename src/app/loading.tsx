import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-60"/>
      <Skeleton className="h-72"/>
    </div>
  )
}
