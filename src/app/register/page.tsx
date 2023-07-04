'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast, Toaster } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import {
    BsEye,
    BsEyeSlash,
    BsGithub,
    BsGoogle,
    BsTwitter
} from 'react-icons/bs'
import { useState } from 'react'
import Link from 'next/link'

const schema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().min(1, { message: 'Email is required' }).email({
            message: 'Must be a valid email'
        }),
        password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password is required' })
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Password don't match"
    })

type formValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

interface ShowState {
    password: boolean
    confirmPassword: boolean
}

const Register = () => {
    const [show, setShow] = useState({
        password: false,
        confirmPassword: false
    })
    const handleClick = (item: keyof ShowState) =>
        setShow((prevState) => ({ ...prevState, [item]: !prevState[item] }))
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ confirmPassword, ...values }: formValues) => {
        try {
            await axios.post('/api/register', JSON.stringify(values))
            signIn('email', {
                redirect: false,
                callbackUrl: '/',
                email: values.email
            })
            toast.success(
                'A verification link has been sent to your email account'
            )
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <section>
            <div>
                <Toaster />
            </div>
            <div className='flex h-[calc(100vh-64px)] align-middle'>
                <form
                    className='m-auto flex w-[20rem] max-w-xs flex-col gap-2 rounded bg-gray-300 p-7 shadow-xl dark:bg-gray-700'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <p className='mb-5 self-center text-2xl'>Sign Up</p>
                    <input
                        className='appearance-none rounded border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                        type='text'
                        placeholder='Name'
                        aria-invalid={errors.name ? 'true' : 'false'}
                        {...register('name')}
                    />
                    <p className='text-xs text-rose-600'>
                        {errors.name?.message}
                    </p>
                    <input
                        className='w-full appearance-none rounded border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                        type='email'
                        placeholder='Email'
                        aria-invalid={errors.email ? 'true' : 'false'}
                        {...register('email')}
                    />
                    <p className='text-xs text-rose-600'>
                        {errors.email?.message}
                    </p>
                    <div className='flex'>
                        <input
                            className='w-full appearance-none rounded-l border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                            type={show.password ? 'text' : 'password'}
                            placeholder='Password'
                            aria-invalid={errors.password ? 'true' : 'false'}
                            {...register('password')}
                        />
                        <button
                            type='button'
                            onClick={() => handleClick('password')}
                            className='rounded-r bg-white pr-3 dark:bg-black'
                        >
                            {show.password ? (
                                <BsEyeSlash className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                            ) : (
                                <BsEye className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                            )}
                        </button>
                    </div>
                    <p className='text-xs text-rose-600'>
                        {errors.password?.message}
                    </p>
                    <div className='flex'>
                        <input
                            className='w-full appearance-none rounded-l border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                            type={show.confirmPassword ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            aria-invalid={
                                errors.confirmPassword ? 'true' : 'false'
                            }
                            {...register('confirmPassword')}
                        />
                        <button
                            type='button'
                            onClick={() => handleClick('confirmPassword')}
                            className='rounded-r bg-white pr-3 dark:bg-black'
                        >
                            {show.confirmPassword ? (
                                <BsEyeSlash className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                            ) : (
                                <BsEye className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                            )}
                        </button>
                    </div>
                    <p className='text-xs text-rose-600'>
                        {errors.confirmPassword?.message}
                    </p>
                    <button
                        className='m-auto w-full rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                        type='submit'
                    >
                        Sign Up
                    </button>
                    <div className='grid grid-cols-3 items-center text-gray-400'>
                        <hr className='border-gray-400' />
                        <p className='text-center text-sm'>OR</p>
                        <hr className='border-gray-400' />
                    </div>
                    <button
                        className='m-auto flex w-full flex-row place-content-evenly items-center rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                        type='button'
                        onClick={() =>
                            signIn('github', {
                                redirect: true,
                                callbackUrl: '/'
                            })
                        }
                    >
                        Sign up with GitHub <BsGithub />
                    </button>
                    <button
                        className='m-auto mt-2 flex w-full flex-row place-content-evenly items-center rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                        type='button'
                        onClick={() =>
                            signIn('google', {
                                redirect: true,
                                callbackUrl: '/'
                            })
                        }
                    >
                        Sign up with Google <BsGoogle />
                    </button>
                    <button
                        className='m-auto mt-2 flex w-full flex-row place-content-evenly items-center rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                        type='button'
                        onClick={() =>
                            signIn('twitter', {
                                redirect: true,
                                callbackUrl: '/'
                            })
                        }
                    >
                        Sign up with Twitter <BsTwitter />
                    </button>
                    <Link
                        href='/login'
                        className='mt-2 self-center text-sm text-gray-500'
                    >
                        Already have an account?
                    </Link>
                </form>
            </div>
        </section>
    )
}

export default Register
