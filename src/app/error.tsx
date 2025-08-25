'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col justify-center gap-1 text-center">
        <h2 className="text-2xl font-semibold">
          Something went wrong!
        </h2>
        <p>Content could not be loaded.</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="cursor-pointer" onClick={ () => reset() }>
          Try Again
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  )
}
