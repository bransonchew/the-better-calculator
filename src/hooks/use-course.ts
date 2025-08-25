import { useContext } from 'react'
import { CourseContext } from '@/context/course-provider'

export function useCourse() {
  return useContext(CourseContext)
}
