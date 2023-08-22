import AuthProvider from '@/context/AuthProvider'
import QueryProvider from '@/context/QueryProvider'
import ReduxProvider from '@/context/ReduxProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <QueryProvider>
                <body className={inter.className}>
                    <AuthProvider>
                        <Toaster />
                        <ReduxProvider>{children}</ReduxProvider>
                    </AuthProvider>
                </body>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryProvider>
        </html>
    )
}
