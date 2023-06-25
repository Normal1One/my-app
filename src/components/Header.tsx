'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { BsPerson } from 'react-icons/bs';

export default function Header() {
    const { data } = useSession();

    if (data && data.user) {
        return (
            <div className='bg-gray-200'>
                <div className='max-w-7xl flex items-center m-auto pt-5 pb-5 justify-around'>
                    <Link href='/' className='hover:opacity-50'>
                        Home
                    </Link>
                    <Link href='/' className='hover:opacity-50'>
                        Protected (Client)
                    </Link>
                    <Link href='/' className='hover:opacity-50'>
                        Protected (Server)
                    </Link>
                    <Link href='/user'>
                        {data.user.image ? (
                            <Image
                                src={data.user.image}
                                width={50}
                                height={50}
                                alt='Your profile picture'
                            ></Image>
                        ) : (
                            <BsPerson />
                        )}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <button onClick={() => signIn()} className='text-green-500 ml-auto'>
            Sign In
        </button>
    );
}
