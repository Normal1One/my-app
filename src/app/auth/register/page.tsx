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
        <div className='flex align-middle h-screen'>
            <form className='flex flex-col m-auto p-7 rounded shadow-xl gap-4 bg-gray-300' onSubmit={registerUser}>
                    <input
                        className='appearance-none leading-tight focus:outline-none rounded border-none'
                        type='text'
                        required
                        value={data.name}
                        placeholder='Username'
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                    ></input>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded border-none'
                        type='text'
                        required
                        value={data.email}
                        placeholder='Email'
                        onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                        }
                    ></input>
                    <input
                        className='appearance-none w-full leading-tight focus:outline-none rounded border-none'
                        type='password'
                        placeholder='Password'
                        required
                        autoComplete='on'
                        value={data.password}
                        onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                        }
                    ></input>
                <button
                    className='font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                    type='submit'
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
