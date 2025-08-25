import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID() {
  return crypto.randomUUID()
}

export function camelCaseToWords(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // insert space before capital letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // handle "HTMLParser" → "HTML Parser"
    .toLowerCase()
}

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-AU', {
    ...options,
  }).format(date)
}
