import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'
import VerificationBanner from './VerificationBanner'
import SignInButton from './ui/SignInButton'
import SignOutButton from './ui/SignOutButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Header = async () => {
    const session = await getServerSession(authOptions)

    return (
        <div className='fixed w-full bg-gray-200'>
            <VerificationBanner />
            <div className='m-auto flex max-w-7xl items-center justify-around pb-5 pt-5'>
                <Link href='/' className='hover:opacity-70'>
                    Home
                </Link>
                {session ? (
                    <>
                        <Link href='/posts/create' className='hover:opacity-70'>
                            Create Post
                        </Link>
                        <Link href='/liked' className='hover:opacity-70'>
                            Liked Posts
                        </Link>
                        <SignOutButton />
                        <Link
                            href={`/users/${session.user.id}`}
                            className='flex hover:opacity-70'
                        >
                            {session.user.image ? (
                                <Image
                                    src={session.user.image}
                                    width={24}
                                    height={24}
                                    className='rounded-full'
                                    alt={session.user.name || ''}
                                />
                            ) : (
                                <BsPerson className='h-6 w-6' />
                            )}
                            <p className='ml-2 max-w-[10rem] truncate'>
                                {session.user.name}
                            </p>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href='/sign-up' className='hover:opacity-70'>
                            Sign Up
                        </Link>
                        <SignInButton />
                    </>
                )}
            </div>
        </div>
    )
}

export default Header
