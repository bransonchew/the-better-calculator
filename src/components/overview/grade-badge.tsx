import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GradeCode } from '@/lib/constants'

export default function GradeBadge({ grade }: { grade: GradeCode }) {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
      <div
        className={ cn(
          'size-2 rounded-xl bg-neutral-500',
          grade === 'HD' && 'bg-chart-1',
          grade === 'D' && 'bg-chart-2',
          grade === 'C' && 'bg-chart-3',
          grade === 'P' && 'bg-chart-4',
          grade === 'N' && 'bg-chart-5',
        ) }
      />
      { grade }
    </Badge>
  )
}
