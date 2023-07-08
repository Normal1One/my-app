'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useState } from 'react'
import Link from 'next/link'
import SocialLoginButtons from '@/components/SocialLoginButtons'

const schema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().min(1, { message: 'Email is required' }).email({
            message: 'Must be a valid email'
        }),
        password: z
            .string()
            .min(1, { message: 'Password is required' })
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

const SignUp = () => {
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
                `A verification link has been sent to ${values.email}`
            )
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className='flex h-screen'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Sign Up</p>
                <label htmlFor='name' className='mb-2 text-sm'>
                    Name
                </label>
                <input
                    className={`rounded border ${
                        errors.name && 'input-invalid'
                    }`}
                    type='text'
                    placeholder='J Smith'
                    id='name'
                    {...register('name')}
                />
                <p className='text-xs text-rose-600'>{errors.name?.message}</p>
                <label htmlFor='email' className='mb-2 text-sm'>
                    Email
                </label>
                <input
                    className={`rounded border ${
                        errors.email && 'input-invalid'
                    }`}
                    type='email'
                    autoComplete='username'
                    placeholder='jsmith@example.com'
                    id='email'
                    {...register('email')}
                />
                <p className='text-xs text-rose-600'>{errors.email?.message}</p>
                <label htmlFor='password' className='mb-2 text-sm'>
                    Password
                </label>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t ${
                            errors.password && 'input-invalid'
                        }`}
                        type={show.password ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='••••••••'
                        id='password'
                        {...register('password')}
                    />
                    <button
                        type='button'
                        onClick={() => handleClick('password')}
                        className={`rounded-r border-b border-r border-t pr-3 ${
                            errors.password
                                ? 'border-rose-600 bg-rose-200'
                                : 'border-gray-400 bg-gray-200'
                        }`}
                    >
                        {show.password ? (
                            <BsEyeSlash className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        ) : (
                            <BsEye className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        )}
                    </button>
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.password?.message}
                </p>
                <label htmlFor='confirmPassword' className='mb-2 text-sm'>
                    Confirm Password
                </label>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t ${
                            errors.confirmPassword && 'input-invalid'
                        }`}
                        type={show.confirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='••••••••'
                        id='confirmPassword'
                        {...register('confirmPassword')}
                    />
                    <button
                        type='button'
                        onClick={() => handleClick('confirmPassword')}
                        className={`rounded-r border-b border-r border-t pr-3 ${
                            errors.confirmPassword
                                ? 'border-rose-600 bg-rose-200'
                                : 'border-gray-400 bg-gray-200'
                        }`}
                    >
                        {show.confirmPassword ? (
                            <BsEyeSlash className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        ) : (
                            <BsEye className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        )}
                    </button>
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.confirmPassword?.message}
                </p>
                <button
                    className='w-full rounded bg-gray-400 pb-3 pt-3 text-white hover:opacity-80'
                    type='submit'
                >
                    Sign Up
                </button>
                <div className='grid grid-cols-3 items-center text-gray-400'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <SocialLoginButtons />
                <p className='mt-2 self-center text-sm'>
                    {'Have an account? '}
                    <Link href='/sign-in' className='text-gray-400 underline'>
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignUp
