import GitHub from '@/components/logo/github'

export default function Footer() {
  return (
    <footer className="w-full border-t pt-6 pb-8 mt-10">
      <div
        className="px-4 flex items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Built by { ' ' }
          <a
            href="https://linkedin.com/in/bransonchew"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline text-muted-foreground"
            aria-label="View source code on GitHub"
          >
            Branson Chew
          </a>
        </p>
        <a
          href="https://github.com/bransonchew/the-better-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline"
          aria-label="View source code on GitHub"
        >
          <GitHub/>
          <span className="text-sm text-muted-foreground">
            Source code
          </span>
        </a>
      </div>
    </footer>
  )
}
