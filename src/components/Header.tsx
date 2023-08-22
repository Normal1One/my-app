'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsPerson } from 'react-icons/bs'
import VerificationBanner from './VerificationBanner'

const Header = () => {
    const { data } = useSession()
    const [defaultValuesSet, setDefaultValuesSet] = useState(false)
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!defaultValuesSet && data) {
            if (
                data?.user.provider === 'credentials' &&
                !data.user.emailVerified
            ) {
                setShow(true)
            }
            setDefaultValuesSet(true)
        }
    }, [data, defaultValuesSet, setShow])

    return (
        <div className='fixed w-full bg-gray-200'>
            <VerificationBanner show={show} setShow={setShow} />
            <div className='m-auto flex max-w-7xl items-center justify-around pb-5 pt-5'>
                <Link href='/' className='hover:opacity-70'>
                    Home
                </Link>
                {data ? (
                    <>
                        <Link href='/posts/create' className='hover:opacity-70'>
                            Create Post
                        </Link>
                        <Link href='/liked' className='hover:opacity-70'>
                            Liked Posts
                        </Link>
                        <button
                            onClick={() =>
                                signOut({
                                    redirect: true,
                                    callbackUrl: '/'
                                })
                            }
                            className='hover:opacity-70'
                        >
                            Sign Out
                        </button>
                        <Link
                            href={`/users/${data.user.id}`}
                            className='flex hover:opacity-70'
                        >
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
                            <p className='ml-2 max-w-[10rem] truncate'>
                                {data.user.name}
                            </p>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href='/sign-up' className='hover:opacity-70'>
                            Sign Up
                        </Link>
                        <button
                            className='hover:opacity-70'
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
