'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e: FormEvent) => {
        e.preventDefault();
        signIn('credentials', { ...data, redirect: false });
    };

    return (
        <div className='max-w-xs m-auto mt-5'>
            <form className='flex flex-col' onSubmit={loginUser}>
                <div className='mb-4'>
                    <label
                        className='block text-sm font-bold mb-2'
                        htmlFor='email'
                    >
                        Email
                    </label>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded'
                        id='email'
                        type='text'
                        required
                        value={data.email}
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                    ></input>
                </div>
                <div className='mb-6'>
                    <label
                        className='block text-sm font-bold mb-2'
                        htmlFor='password'
                    >
                        Password
                    </label>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded'
                        id='password'
                        type='password'
                        required
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    ></input>
                </div>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-black rounded pt-3 pb-3 hover:opacity-75 w-full'
                    type='submit'
                >
                    Sign In
                </button>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-black rounded pt-3 pb-3 hover:opacity-75 w-full'
                    onClick={() => signIn('github')}
                >
                    Sign In
                </button>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-black rounded pt-3 pb-3 hover:opacity-75 w-full'
                    onClick={() => signIn('google')}
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
