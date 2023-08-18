'use client'

import Button from '@/components/Button'
import PasswordButton from '@/components/PasswordButton'
import SocialLoginButtons from '@/components/SocialLoginButtons'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { isAxiosError } from 'axios'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

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
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState<string>()
    const handleClick = (item: keyof ShowState) =>
        setShow((prevState) => ({ ...prevState, [item]: !prevState[item] }))
    const [isLoading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ confirmPassword, ...values }: formValues) => {
        try {
            setLoading(true)
            await axios.post('/api/users', JSON.stringify(values))
            await signIn('email', {
                redirect: false,
                callbackUrl: '/',
                email: values.email
            })
            setEmail(values.email)
            setSuccess(true)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className='absolute top-1/2 w-full text-center text-lg'>
                Verification email has been sent to {email}, please check your
                email
            </div>
        )
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
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.name &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
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
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.email &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
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
                        className={`w-full rounded-l border-b border-l border-t border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                            errors.password &&
                            'border-rose-600 bg-rose-200 placeholder-rose-600'
                        }`}
                        type={show.password ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='••••••••'
                        id='password'
                        {...register('password')}
                    />
                    <PasswordButton
                        isHidden={show.password}
                        isInvalid={errors.password}
                        handleClick={() => handleClick('password')}
                    />
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.password?.message}
                </p>
                <label htmlFor='confirmPassword' className='mb-2 text-sm'>
                    Confirm Password
                </label>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                            errors.confirmPassword &&
                            'border-rose-600 bg-rose-200 placeholder-rose-600'
                        }`}
                        type={show.confirmPassword ? 'text' : 'password'}
                        autoComplete='new-password'
                        placeholder='••••••••'
                        id='confirmPassword'
                        {...register('confirmPassword')}
                    />
                    <PasswordButton
                        isHidden={show.confirmPassword}
                        isInvalid={errors.confirmPassword}
                        handleClick={() => handleClick('confirmPassword')}
                    />
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.confirmPassword?.message}
                </p>
                <Button
                    text='Sign Up'
                    loadingText='Signing Up...'
                    isLoading={isLoading}
                />
                <div className='grid grid-cols-3 items-center text-gray-400'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <SocialLoginButtons />
                <p className='mt-2 self-center text-sm'>
                    {'Have an account? '}
                    <Link
                        href='/sign-in'
                        className='text-gray-400 underline hover:opacity-70'
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignUp
