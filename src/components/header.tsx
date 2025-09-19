import ModeToggle from '@/components/mode-toggler'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="pt-16 md:pt-20 lg:pt-24 pb-2">
      <div className="absolute right-3 top-3 lg:right-6 lg:top-6">
        <ModeToggle/>
      </div>
      <div className="flex flex-col items-center">
        <Link href="/">
          <h1
            className="text-center text-3xl md:text-5xl font-bold tracking-tight text-balance"
          >
            The Better Calculator
          </h1>
        </Link>
        <div className="text-base text-pretty text-center w-80 sm:text-lg sm:w-96 md:w-lg lg:w-2xl mt-4">
          <p>
            Because Monash students deserve better than spreadsheets.
            Start tracking your results with ease 📊.
          </p>
          <p>
            🔒 Your data stays with you. No account needed.
          </p>
        </div>
        <Badge variant="secondary" className="mt-5" asChild>
          <Link href="/projection">
            New Future Projection Feature <ArrowRight/>
          </Link>
        </Badge>
      </div>
    </header>
  )
}
