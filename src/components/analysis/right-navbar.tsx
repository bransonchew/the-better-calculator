'use client'

import React, { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import useHash from '@/hooks/use-hash'
import { cn } from '@/lib/utils'

type RightNavbarProps = {
  sections: { id: string; label: string }[]
}

export default function RightNavbar({ sections }: RightNavbarProps) {

  const hash = useHash()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -80 // sticky header height
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      window.location.hash = `#${ id }`
    }
  }

  useEffect(() => {
    const section = hash.replace('#', '')
    if (section) scrollToSection(section)
  }, [hash])

  return (
    <nav className="flex sticky top-20">
      <div>
        <Separator orientation="vertical"/>
      </div>
      <div className="flex flex-col gap-4 text-sm text-muted-foreground">
        { sections.map(({ id, label }) => (
          <p
            key={ id }
            onClick={ () => scrollToSection(id) }
            className={ cn(
              'px-4 cursor-pointer transition duration-150 hover:text-foreground hover:border-l border-foreground',
              hash.slice(1) === id && 'text-foreground border-l',
            ) }
          >
            { label }
          </p>
        )) }
      </div>
    </nav>
  )
}
