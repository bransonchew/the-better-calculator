'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Overview', href: '/' },
  { name: 'Analysis', href: '/analysis' },
  { name: 'Projection', href: '/projection' },
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-6 px-5 py-4 sticky top-0 z-50 justify-center sm:justify-start bg-gradient-to-b from-background/80 to-background/60 backdrop-blur-md">
      { navLinks.map(link => (
        <Link
          key={ link.href }
          href={ link.href }
          className={ cn(
            'text-base transition-colors hover:text-foreground hover:font-medium text-muted-foreground',
            pathname === link.href && 'text-foreground font-medium',
          ) }
        >
          { link.name }
        </Link>
      )) }
    </nav>
  )
}
