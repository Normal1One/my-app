'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'

const Header = () => {
    const { data } = useSession()

    return (
        <div className='bg-gray-200 dark:bg-gray-800'>
            <div className='m-auto flex max-w-7xl items-center justify-around pb-5 pt-5'>
                <Link href='/' className='hover:opacity-80'>
                    Home
                </Link>
                <Link href='/register' className='hover:opacity-80'>
                    Sign Up
                </Link>
                <Link href='/user/reset-password' className='hover:opacity-80'>
                    Reset Password
                </Link>
                {data ? (
                    <>
                        <button
                            onClick={() =>
                                signOut({ redirect: true, callbackUrl: '/' })
                            }
                        >
                            Sign Out
                        </button>
                        <Link href={`/user/${data.user.id}`}>
                            {data.user.image ? (
                                <Image
                                    src={data.user.image}
                                    width={24}
                                    height={24}
                                    className='rounded-full'
                                    alt={data.user.name || ''}
                                />
                            ) : (
                                <BsPerson className='h-6 w-6' />
                            )}
                        </Link>
                    </>
                ) : (
                    <button onClick={() => signIn()}>Sign In</button>
                )}
            </div>
        </div>
    )
}

export default Header
