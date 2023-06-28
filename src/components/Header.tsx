'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { BsPerson } from 'react-icons/bs';

export default function Header() {
    const { data } = useSession();

    return (
        <div className='bg-gray-200'>
            <div className='max-w-7xl flex items-center m-auto pt-5 pb-5 justify-around'>
                <Link href='/' className='hover:opacity-50'>
                    Home
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
                                    width={48}
                                    height={48}
                                    alt='Your profile picture'
                                />
                            ) : (
                                <BsPerson className='w-12 h-12' />
                            )}
                        </Link>
                    </>
                ) : (
                    <button onClick={() => signIn()}>Sign In</button>
                )}
            </div>
        </div>
    );
}
