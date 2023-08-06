'use client'

import Button from '@/components/Button'
import PasswordButton from '@/components/PasswordButton'
import SocialLoginButtons from '@/components/SocialLoginButtons'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
})

type formValues = {
    email: string
    password: string
}

const SignIn = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const router = useRouter()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: formValues) => {
        signIn('credentials', { ...data, redirect: false }).then((callback) => {
            if (callback?.error) {
                switch (callback.error.split(' ').pop()) {
                    case '404': {
                        toast.error('No user found')
                        break
                    }
                    case '401': {
                        toast.error('Incorrect password')
                        break
                    }
                    default: {
                        toast.error('Something went wrong')
                    }
                }
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Signed in successfully')
                router.push('/')
            }
        })
    }

    useEffect(() => {
        if (error && error === 'OAuthAccountNotLinked') {
            toast.error(
                'To confirm your identity, sign in with the same account you used originally.'
            )
        }
    }, [error])

    return (
        <div className='flex h-screen'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Sign In</p>
                <label htmlFor='email' className='mb-2 text-sm'>
                    Email
                </label>
                <input
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.email &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
                    }`}
                    type='text'
                    placeholder='jsmith@example.com'
                    autoComplete='username'
                    id='email'
                    {...register('email')}
                ></input>
                <p className='text-xs text-rose-600'>{errors.email?.message}</p>
                <div className='mb-2 flex justify-between'>
                    <label htmlFor='password' className='text-sm'>
                        Password
                    </label>
                    <Link
                        href='/forgot'
                        className='w-max text-sm text-gray-400'
                    >
                        Forgot Password?
                    </Link>
                </div>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                            errors.password &&
                            'border-rose-600 bg-rose-200 placeholder-rose-600'
                        }`}
                        type={show ? 'text' : 'password'}
                        placeholder='••••••••'
                        autoComplete='current-password'
                        id='password'
                        {...register('password')}
                    />
                    <PasswordButton
                        isHidden={show}
                        isInvalid={errors.password}
                        handleClick={() => handleClick()}
                    />
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.password?.message}
                </p>
                <Button text='Sign In' />
                <div className='grid grid-cols-3 items-center text-gray-400'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <SocialLoginButtons />
                <p className='mt-2 self-center text-sm'>
                    {"Don't have an account? "}
                    <Link href='/sign-up' className='text-gray-400 underline'>
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignIn
