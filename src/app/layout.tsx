'use client'

import AuthProvider from '@/context/AuthProvider'
import QueryProvider from '@/context/QueryProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <html lang='en'>
            <QueryProvider>
                <body className={inter.className}>
                    <AuthProvider>
                        <Toaster />
                        {![
                            '/sign-up',
                            '/sign-in',
                            '/forgot',
                            '/reset'
                        ].includes(pathname) && <Header />}
                        {children}
                    </AuthProvider>
                </body>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryProvider>
        </html>
    )
}
