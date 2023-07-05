'use client'

import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ServerThemeProvider } from '@wits/next-themes'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ServerThemeProvider attribute='class'>
            <html lang='en'>
                <body className={inter.className}>
                    <SessionProvider>
                        <Toaster />
                        {children}
                    </SessionProvider>
                </body>
            </html>
        </ServerThemeProvider>
    )
}
