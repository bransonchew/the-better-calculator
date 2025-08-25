'use client'

import GPA from '@/components/analysis/gpa'
import WAM from '@/components/analysis/wam'
import GradeDist from '@/components/analysis/grade-dist'
import WeightedGrades from '@/components/analysis/weighted-grades'
import UnitMarks from '@/components/analysis/unit-marks'
import RightNavbar from '@/components/analysis/right-navbar'
import { useCourse } from '@/hooks/use-course'
import NoUnits from '@/components/no-units'

const sections = [
  { id: 'gpa', label: 'GPA' },
  { id: 'wam', label: 'WAM' },
  { id: 'grades', label: 'Grades' },
  { id: 'units', label: 'Units' },
]

export default function Analysis() {

  const { isEmpty } = useCourse()

  if (isEmpty) return <NoUnits/>

  return (
    <div className="flex gap-6">

      {/*Charts*/ }
      <div className="w-full sm:w-5/6 grid gap-5">
        <div id="gpa">
          <GPA/>
        </div>
        <div id="wam">
          <WAM/>
        </div>
        <div id="grades" className="grid lg:grid-cols-2 gap-5">
          <GradeDist/>
          <WeightedGrades/>
        </div>
        <div id="units">
          <UnitMarks/>
        </div>
      </div>

      {/*Navbar*/ }
      <div className="hidden sm:block -mt-16">
        <RightNavbar sections={ sections }/>
      </div>

    </div>
  )
}
