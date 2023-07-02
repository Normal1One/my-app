import { ServerThemeProvider } from '@wits/next-themes'
import { ReactNode } from 'react'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ServerThemeProvider attribute='class'>{children}</ServerThemeProvider>
    )
}

export default ThemeProvider
