'use client';

import { signIn } from 'next-auth/react';
import { BsGoogle, BsGithub } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';

const schema = yup
    .object({
        email: yup.string().email(),
        password: yup.string(),
    })
    .required();

type formValues = {
    email: string;
    password: string;
};

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: formValues) => {
        signIn('credentials', { ...data, redirect: false }).then((callback) => {
            if (callback?.error) {
                toast.error(callback.error);
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Logged in successfully!');
            }
        });
    };

    return (
        <section>
            <div>
                <Toaster />
            </div>
            <div className='flex align-middle h-screen'>
                <form
                    className='flex flex-col m-auto p-7 max-w-xs rounded shadow-xl gap-4 bg-gray-300'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <input
                        className='appearance-none leading-tight p-3 focus:outline-none rounded border-none'
                        type='text'
                        placeholder='Email'
                        {...register('email')}
                    ></input>
                    {errors.email && <p className='text-red-500'>{errors.email?.message}</p>}
                    <input
                        className='appearance-none leading-tight p-3 focus:outline-none rounded border-none'
                        type='password'
                        placeholder='Password'
                        {...register('password')}
                    ></input>
                    {errors.password && <p className='text-red-500'>{errors.password?.message}</p>}
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
        </section>
    );
}
