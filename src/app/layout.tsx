import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import Provider from '@/components/Provider'

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
                <Provider>
                    <Toaster />
                    {children}
                </Provider>
            </body>
        </html>
    )
}
