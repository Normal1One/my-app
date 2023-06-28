'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { BsGithub, BsGoogle } from 'react-icons/bs';

const schema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().min(1, { message: 'Email is required' }).email({
            message: 'Must be a valid email',
        }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Password don't match",
    });

type formValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async ({ confirmPassword, ...values }: formValues) => {
        axios
            .post('/api/register', JSON.stringify(values))
            .then(() => toast.success('Registered successfully!'))
            .catch(() => toast.error('Something went wrong!'));
    };

    return (
        <section>
            <div>
                <Toaster />
            </div>
            <div className='flex align-middle h-[calc(100vh-64px)]'>
                <form
                    className='w-[20rem] flex flex-col m-auto min-w-max p-7 rounded shadow-xl gap-2 bg-gray-300'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <input
                        className='appearance-none leading-tight p-3 focus:outline-none rounded aria-invalid:border-2 border-rose-600'
                        type='text'
                        placeholder='Name'
                        aria-invalid={errors.name ? 'true' : 'false'}
                        {...register('name')}
                    ></input>
                    <p className='text-rose-600 text-xs'>{errors.name?.message}</p>
                    <input
                        className='appearance-none w-full leading-tight p-3 focus:outline-none rounded aria-invalid:border-2 border-rose-600'
                        type='email'
                        placeholder='Email'
                        aria-invalid={errors.email ? 'true' : 'false'}
                        {...register('email')}
                    ></input>
                    <p className='text-rose-600 text-xs'>{errors.email?.message}</p>
                    <input
                        className='appearance-none w-full leading-tight p-3 focus:outline-none rounded aria-invalid:border-2 border-rose-600'
                        type='password'
                        placeholder='Password'
                        aria-invalid={errors.password ? 'true' : 'false'}
                        {...register('password')}
                    ></input>
                    <p className='text-rose-600 text-xs'>{errors.password?.message}</p>
                    <input
                        className='appearance-none w-full leading-tight p-3 focus:outline-none rounded aria-invalid:border-2 border-rose-600'
                        type='password'
                        placeholder='Confirm Password'
                        aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                        {...register('confirmPassword')}
                    ></input>
                    <p className='text-rose-600 text-xs'>
                        {errors.confirmPassword?.message}
                    </p>
                    <button
                        className='font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 pb-3 hover:opacity-75 w-full'
                        type='submit'
                    >
                        Sign Up
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
                        Sign up with GitHub <BsGithub />
                    </button>
                    <button
                        className='flex flex-row items-center place-content-evenly font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 mt-2 pb-3 hover:opacity-75 w-full'
                        onClick={() => signIn('google')}
                    >
                        Sign up with Google <BsGoogle />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Register;
