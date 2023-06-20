'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

const Home = () => {
    const { data } = useSession();

    if (data && data.user) {
        return (
            <div className='flex ml-auto gap-4'>
                <p className='text-gray-400'>{data.user.email}</p>
                <button onClick={() => signOut()} className='text-red-500'>
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <button onClick={() => signIn()} className='text-green-500 ml-auto'>
            Sign In
        </button>
    );
};

export default Home;
