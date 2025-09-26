import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'

import { SupabaseProvider, AuthProvider } from '@/components/providers'

import './globals.css'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'codeWinter ❄️',
  description:
    'Plan architecture graphs and generate interlinked PRDs in minutes.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 antialiased`}
      >
        <SupabaseProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              {children}
            </div>
          </AuthProvider>
        </SupabaseProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
