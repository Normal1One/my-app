'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BsGoogle, BsGithub } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast, Toaster } from 'react-hot-toast';

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email',
    }),
    password: z
        .string()
        .min(8, { message: 'Password must be atleast 8 characters' }),
});

type formValues = {
    email: string;
    password: string;
};

const Login = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<formValues>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: formValues) => {
        signIn('credentials', { ...data, redirect: false }).then((callback) => {
            if (callback?.error) {
                toast.error(callback.error);
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Logged in successfully!');
                setTimeout(() => router.push('/'), 1000);
            }
        });
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
                        placeholder='Email'
                        aria-invalid={errors.email ? 'true' : 'false'}
                        {...register('email')}
                    ></input>
                    <p className='text-rose-600 text-xs'>{errors.email?.message}</p>
                    <input
                        className='appearance-none leading-tight p-3 focus:outline-none rounded aria-invalid:border-2 border-rose-600'
                        type='password'
                        placeholder='Password'
                        aria-invalid={errors.password ? 'true' : 'false'}
                        {...register('password')}
                    ></input>
                    <p className='text-rose-600 text-xs'>{errors.password?.message}</p>
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
                        className='flex flex-row items-center place-content-evenly font-bold focus:outline-none m-auto text-white bg-gray-500 rounded pt-3 mt-2 pb-3 hover:opacity-75 w-full'
                        onClick={() => signIn('google')}
                    >
                        Login with Google <BsGoogle />
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
