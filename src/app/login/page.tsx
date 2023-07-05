'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    BsGoogle,
    BsGithub,
    BsTwitter,
    BsEyeSlash,
    BsEye
} from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import Link from 'next/link'

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    }),
    password: z
        .string()
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
                toast.success('Logged in successfully!')
                setTimeout(() => router.push('/'), 1000)
            }
        })
    }

    return (
        <div className='flex h-[calc(100vh-64px)] align-middle'>
            <form
                className='m-auto flex w-[20rem] max-w-xs flex-col gap-2 rounded bg-gray-300 p-7 shadow-xl dark:bg-gray-700'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Sign In</p>
                <input
                    className='appearance-none rounded border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                    type='text'
                    placeholder='Email'
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                ></input>
                <p className='text-xs text-rose-600'>{errors.email?.message}</p>
                <div className='flex'>
                    <input
                        className='w-full appearance-none rounded-l border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                        type={show ? 'text' : 'password'}
                        placeholder='Password'
                        aria-invalid={errors.password ? 'true' : 'false'}
                        {...register('password')}
                    />
                    <button
                        type='button'
                        onClick={handleClick}
                        className='rounded-r bg-white pr-3 dark:bg-black'
                    >
                        {show ? (
                            <BsEyeSlash className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                        ) : (
                            <BsEye className='h-5 w-5 fill-gray-500 hover:opacity-80' />
                        )}
                    </button>
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.password?.message}
                </p>
                <Link
                    href='/forgot'
                    className='mb-2 w-max text-sm text-gray-500'
                >
                    Forgot password?
                </Link>
                <button
                    className='m-auto w-full rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                    type='submit'
                >
                    Sign in
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
                    Sign in with GitHub <BsGithub />
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
                    Sign in with Google <BsGoogle />
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
                    Sign in with Twitter <BsTwitter />
                </button>
                <Link
                    href='/register'
                    className='mt-2 self-center text-sm text-gray-500'
                >
                    Not registered yet?
                </Link>
            </form>
        </div>
    )
}

export default SignIn
