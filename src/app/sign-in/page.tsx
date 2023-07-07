'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { BsEyeSlash, BsEye } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import Link from 'next/link'
import SocialLoginButtons from '@/components/SocialLoginButtons'

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
                toast.error(callback.error)
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Signed in successfully!')
                setTimeout(() => router.push('/'), 1000)
            }
        })
    }

    return (
        <div className='flex h-screen'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>
                    Sign in to your account
                </p>
                <label htmlFor='email' className='mb-2 text-sm'>
                    Email
                </label>
                <input
                    className={`rounded border ${
                        errors.email && 'input-invalid'
                    }`}
                    type='text'
                    placeholder='jsmith@example.com'
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
                        className={`w-full rounded-l border-b border-l border-t ${
                            errors.password && 'input-invalid'
                        }`}
                        type={show ? 'text' : 'password'}
                        placeholder='••••••••'
                        id='password'
                        {...register('password')}
                    />
                    <button
                        type='button'
                        onClick={handleClick}
                        className={`rounded-r border-b border-r border-t pr-3 ${
                            errors.password
                                ? 'border-rose-600 bg-rose-200'
                                : 'border-gray-400 bg-gray-200'
                        }`}
                    >
                        {show ? (
                            <BsEyeSlash className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        ) : (
                            <BsEye className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        )}
                    </button>
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.password?.message}
                </p>
                <button
                    className='w-full rounded bg-gray-400 pb-3 pt-3 text-white hover:opacity-80'
                    type='submit'
                >
                    Sign in
                </button>
                <div className='grid grid-cols-3 items-center text-gray-400'>
                    <hr className='border-gray-400' />
                    <p className='text-center text-sm'>OR</p>
                    <hr className='border-gray-400' />
                </div>
                <SocialLoginButtons />
                <p className='mt-2 self-center text-sm'>
                    {"Don't have an account? "}
                    <Link href='/register' className='text-gray-400 underline'>
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default SignIn
