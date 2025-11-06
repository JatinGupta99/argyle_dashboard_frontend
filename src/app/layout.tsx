import type { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'Event Dashboard',
  description: 'Modern dashboard for managing schedules, agendas, and speakers.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
