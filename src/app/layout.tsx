import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/theme-provider'
import Header from '@/components/header'
import React from 'react'
import { Navbar } from '@/components/navbar'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { CourseProvider } from '@/context/course-provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'The Better Calculator',
  description: 'The Better Calculator gives you a clear overview of GPA, WAM, credit points, and honours progress — all in one simple dashboard.',
  openGraph: {
    title: 'The Better Calculator | GPA & WAM Dashboard',
    description: 'Monitor GPA and WAM, spot trends, and plan future performance. Stay on top of your performance at a glance.',
    url: `${ process.env.NEXT_PUBLIC_BASE_URL }`,
    siteName: 'The Better Calculator',
    type: 'website',
    images: [
      {
        url: `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/assets/opengraph-image.jpeg`,
        alt: 'The Better Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Better Calculator | GPA & WAM Dashboard',
    description: 'Monitor GPA and WAM, spot trends, and plan future performance — all in one place. Stay on top of your performance at a glance.',
    images: [`${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/assets/opengraph-image.jpeg`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
    >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen">
        <Header/>
        <Navbar/>
        <main className="grow px-5 pt-3 pb-5">
          <CourseProvider>
            { children }
          </CourseProvider>
        </main>
        <Footer/>
      </div>
      <Toaster position="bottom-center"/>
    </ThemeProvider>
    <Analytics/>
    <SpeedInsights/>
    </body>
    </html>
  )
}
