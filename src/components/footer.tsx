import GitHub from '@/components/logo/github'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t px-4 pt-6 pb-8 mt-10 sm:text-sm text-muted-foreground">
      <div className="flex flex-wrap justify-between sm:flex-nowrap sm:justify-between gap-5 sm:gap-0">

        {/* Item 1 */ }
        <div className="order-2 justify-start sm:order-1 sm:w-auto">
          <div>
            Built by { ' ' }
            <Link
              href="https://github.com/bransonchew"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline underline-offset-4"
              aria-label="View source code on GitHub"
            >
              Branson Chew
            </Link>
          </div>
        </div>

        {/* Item 2 */ }
        <div className="order-1 w-full sm:order-2 sm:w-auto">
          <div className="flex justify-center space-x-2">
            <Link href="/about" className="hover:underline underline-offset-4">
              About
            </Link>
            <span>•</span>
            <Link href="/" className="hover:underline underline-offset-4">
              © { new Date().getFullYear() } The Better Calculator
            </Link>
          </div>
        </div>

        {/* Item 3 */ }
        <div className="order-3 justify-end sm:order-3 sm:w-auto">
          <Link
            href="https://github.com/bransonchew/the-better-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:underline underline-offset-4"
            aria-label="View source code on GitHub"
          >
            <GitHub/> Source code
          </Link>
        </div>

      </div>
    </footer>
  )
}
