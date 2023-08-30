import Link from 'next/link'
import HeaderAuthenticated from './HeaderAuthenticated'
import VerificationBanner from './VerificationBanner'

const Header = () => {
    return (
        <div className='fixed w-full bg-gray-200'>
            <VerificationBanner />
            <div className='m-auto flex max-w-7xl items-center justify-around pb-5 pt-5'>
                <Link href='/' className='hover:opacity-70'>
                    Home
                </Link>
                <HeaderAuthenticated />
            </div>
        </div>
    )
}

export default Header
