import Header from '@/components/Header'
import Provider from '../components/Provider'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'

const inter = Inter({
    subsets: ['latin']
})

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider>
            <html lang='en'>
                <body className={inter.className}>
                    <Provider>
                        <Header />
                        {children}
                    </Provider>
                </body>
            </html>
        </ThemeProvider>
    )
}
