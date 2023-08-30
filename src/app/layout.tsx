import Header from '@/components/Header'
import AuthProvider from '@/context/AuthProvider'
import QueryProvider from '@/context/QueryProvider'
import ReduxProvider from '@/context/ReduxProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'

export const metadata: Metadata = {
    title: 'Posts'
}

const inter = Inter({
    subsets: ['latin']
})

interface Props {
    children: ReactNode
}

const RootLayout = ({ children }: Props) => {
    return (
        <html lang='en'>
            <QueryProvider>
                <body className={inter.className}>
                    <AuthProvider>
                        <ReduxProvider>
                            <Toaster />
                            <Header />
                            {children}
                        </ReduxProvider>
                    </AuthProvider>
                </body>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryProvider>
        </html>
    )
}

export default RootLayout
