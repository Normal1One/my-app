import { useTheme } from '@wits/next-themes'
import { BsMoon, BsSun } from 'react-icons/bs'

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme()

    return (
        <div>
            {theme === 'dark' ? (
                <BsMoon
                    className='cursor-pointer'
                    onClick={() => setTheme('light')}
                />
            ) : (
                <BsSun
                    className='cursor-pointer'
                    onClick={() => setTheme('dark')}
                />
            )}
        </div>
    )
}

export default ThemeChanger
