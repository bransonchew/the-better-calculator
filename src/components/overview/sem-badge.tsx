import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SemesterCode, Semesters } from '@/lib/constants'

export default function SemBadge({ semester }: { semester: SemesterCode }) {
  const monthIndex = Semesters[semester].monthIndex
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5 font-mono">
      <div
        className={ cn(
          'size-2 rounded-xl bg-chart-5',
          monthIndex === 6 && 'bg-chart-2',
          monthIndex === 11 && 'bg-chart-4',
          monthIndex === 2 && 'bg-chart-3',
          monthIndex === 7 && 'bg-chart-1',
          monthIndex === 4 && 'bg-chart-5',
        ) }
      />
      { semester }
    </Badge>
  )
}
