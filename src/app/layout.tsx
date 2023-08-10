import AuthProvider from '@/context/AuthProvider'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import VerificationBanner from '@/components/VerificationBanner'

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
            <body className={inter.className}>
                <AuthProvider>
                    <Toaster />
                    <VerificationBanner />
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}
