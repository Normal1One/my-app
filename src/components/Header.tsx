'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'

const Header = () => {
    const { data } = useSession()

    return (
        <div className='bg-gray-200'>
            <div className='m-auto flex max-w-7xl items-center justify-around pb-5 pt-5'>
                <Link href='/' className='hover:opacity-80'>
                    Home
                </Link>
                {data ? (
                    <>
                        <button
                            onClick={() =>
                                signOut({ redirect: true, callbackUrl: '/' })
                            }
                            className='hover:opacity-80'
                        >
                            Sign Out
                        </button>
                        <Link
                            href={`/users/${data.user.id}`}
                            className='flex hover:opacity-80'
                        >
                            {data.user.image ? (
                                <Image
                                    src={data.user.image}
                                    width={24}
                                    height={24}
                                    className='mr-2 rounded-full'
                                    alt={data.user.name || ''}
                                />
                            ) : (
                                <BsPerson className='h-6 w-6' />
                            )}
                            <p className='max-w-[10rem] truncate'>
                                {data.user.name}
                            </p>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href='/sign-up' className='hover:opacity-80'>
                            Sign Up
                        </Link>
                        <button
                            className='hover:opacity-80'
                            onClick={() => signIn()}
                        >
                            Sign In
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Header
