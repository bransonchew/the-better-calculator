'use client'

import { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Info } from 'lucide-react'
import { useTouch } from '@/hooks/use-touch'

export default function InfoTooltip({ children }: { children: ReactNode }) {

  const isTouch = useTouch()

  // Use Popover on mobile
  if (isTouch) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Info size={ 15 }/>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          { children }
        </PopoverContent>
      </Popover>
    )
  }

  // Use Tooltip on desktop
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={ 15 }/>
        </TooltipTrigger>
        <TooltipContent>
          { children }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
