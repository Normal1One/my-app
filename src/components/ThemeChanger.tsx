import { useTheme } from '@wits/next-themes'
import { BsMoon, BsSun } from 'react-icons/bs'

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div>
            {theme === 'dark' ? (
                <BsMoon
                    className='h-6 w-6 cursor-pointer'
                    onClick={() => setTheme('light')}
                />
            ) : (
                <BsSun
                    className='h-6 w-6 cursor-pointer'
                    onClick={() => setTheme('dark')}
                />
            )}
        </div>
    )
}

export default ThemeChanger
