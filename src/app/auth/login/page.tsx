'use client';

import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { BsGoogle, BsGithub } from 'react-icons/bs';

export default function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [email, setEmail] = useState('');

    const handleCredentialsSubmit = (e: FormEvent) => {
        e.preventDefault();
        signIn('credentials', { ...data, redirect: true, callbackUrl: '/' });
    };

    const handleEmailSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!email) {
            return false;
        }
        signIn('email', { email, redirect: true, callbackUrl: '/' });
    };

    return (
        <div className='flex align-middle h-screen'>
            <form
                className='flex flex-col m-auto p-7 rounded shadow-xl gap-4 bg-gray-300'
                onSubmit={handleCredentialsSubmit}
            >
                <input
                    className='appearance-none leading-tight focus:outline-none rounded border-none'
                    type='text'
                    placeholder='Email'
                    required
                    value={data.email}
                    onChange={(e) =>
                        setData({ ...data, email: e.target.value })
                    }
                ></input>
                <input
                    className='appearance-none leading-tight focus:outline-none rounded border-none'
                    type='password'
                    placeholder='Password'
                    required
                    value={data.password}
                    autoComplete='on'
                    onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                    }
                ></input>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                    type='submit'
                >
                    Login
                </button>
                <div className='grid grid-cols-3 text-gray-400 items-center'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <input
                    className='appearance-none leading-tight focus:outline-none rounded border-none'
                    type='email'
                    placeholder='Email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                    onClick={handleEmailSubmit}
                >
                    Login with Email
                </button>
                <div className='grid grid-cols-3 text-gray-400 items-center'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <button
                    className='flex flex-row items-center place-content-evenly font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                    onClick={() => signIn('github')}
                >
                    Login with GitHub <BsGithub />
                </button>
                <button
                    className='flex flex-row items-center place-content-evenly font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                    onClick={() => signIn('google')}
                >
                    Login with Google <BsGoogle />
                </button>
            </form>
        </div>
    );
}
