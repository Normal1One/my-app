import Header from '@/components/Header';
import Provider from '../components/Provider';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <Provider>
                    <Header />
                    {children}
                </Provider>
            </body>
        </html>
    );
}
