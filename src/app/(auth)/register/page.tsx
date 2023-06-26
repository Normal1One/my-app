'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { BsGithub, BsGoogle } from 'react-icons/bs';

const schema = yup
    .object({
        name: yup.string(),
        email: yup.string().email(),
        password: yup.string(),
    })
    .required();

type formValues = {
    name: string;
    email: string;
    password: string;
};

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: formValues) => {
        axios
            .post('/api/register', JSON.stringify(data))
            .then(() => toast.success('Registered successfully!'))
            .catch(() => toast.error('Something went wrong!'));
    };

    return (
        <section>
            <div>
                <Toaster />
            </div>
            <div className='flex align-middle h-screen'>
                <form
                    className='flex flex-col m-auto p-7 rounded shadow-xl gap-4 bg-gray-300'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <input
                        className='appearance-none leading-tight p-3 focus:outline-none rounded border-none'
                        type='text'
                        placeholder='Name'
                        {...register('name')}
                    ></input>
                    {errors.name && (
                        <p className='text-red-500'>{errors.name?.message}</p>
                    )}
                    <input
                        className='appearance-none w-full leading-tight p-3 focus:outline-none rounded border-none'
                        type='email'
                        placeholder='Email'
                        {...register('email')}
                    ></input>
                    {errors.email && (
                        <p className='text-red-500'>{errors.email?.message}</p>
                    )}
                    <input
                        className='appearance-none w-full leading-tight p-3 focus:outline-none rounded border-none'
                        type='password'
                        autoComplete='on'
                        placeholder='Password'
                        {...register('password')}
                    ></input>
                    {errors.password && (
                        <p className='text-red-500'>
                            {errors.password?.message}
                        </p>
                    )}
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
};

export default Register;
