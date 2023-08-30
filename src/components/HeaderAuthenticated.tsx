'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'
import SignInButton from './ui/SignInButton'
import SignOutButton from './ui/SignOutButton'

const HeaderAuthenticated = () => {
    const { data } = useSession()

    if (!data) {
        return (
            <>
                <Link href='/sign-up' className='hover:opacity-70'>
                    Sign Up
                </Link>
                <SignInButton />
            </>
        )
    }

    return (
        <>
            <Link href='/posts/create' className='hover:opacity-70'>
                Create Post
            </Link>
            <Link href='/liked' className='hover:opacity-70'>
                Liked Posts
            </Link>
            <SignOutButton />
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
                <p className='ml-2 max-w-[10rem] truncate'>{data.user.name}</p>
            </Link>
        </>
    )
}

export default HeaderAuthenticated
