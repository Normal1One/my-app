'use client';

import { FormEvent, useState } from 'react';

export default function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const registerUser = async (e: FormEvent) => {
        e.preventDefault();
        await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    };

    return (
        <div className='max-w-xs m-auto mt-5'>
            <form className='flex flex-col' onSubmit={registerUser}>
                <div className='mb-4'>
                    <label
                        className='block text-sm font-bold mb-2'
                        htmlFor='username'
                    >
                        Username
                    </label>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded'
                        id='username'
                        type='text'
                        required
                        value={data.name}
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                    ></input>
                </div>
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
                    Sign Up
                </button>
            </form>
        </div>
    );
}
