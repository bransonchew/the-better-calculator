import { Badge } from '@/components/ui/badge'
import { Award, BadgeCheck, Crown, Medal } from 'lucide-react'
import { HonoursCourseGrade } from '@/lib/constants'

export default function HonoursBadge({ honours }: { honours: HonoursCourseGrade }) {
  let icon
  if (honours.code === 'H1') icon = <Crown/>
  else if (honours.code === 'H2A') icon = <Award/>
  else if (honours.code === 'H2B') icon = <Medal/>
  else icon = <BadgeCheck/>
  return (
    <Badge variant="secondary">
      { icon } { honours.title }
    </Badge>
  )
}
