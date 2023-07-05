'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    })
})

const Forgot = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ email: string }>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ email }: { email: string }) => {
        try {
            signIn('email', { email, redirect: false, callbackUrl: '/' })
            toast.success(
                'A verification link has been sent to your email account'
            )
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <div className='flex h-[calc(100vh-64px)] align-middle'>
            <form
                className='m-auto flex w-[20rem] max-w-xs flex-col gap-2 rounded bg-gray-300 p-7 shadow-xl dark:bg-gray-700'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Sign in with Email</p>
                <input
                    className='appearance-none rounded border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                    type='text'
                    placeholder='Email'
                    aria-invalid={errors.email ? 'true' : 'false'}
                    {...register('email')}
                ></input>
                <p className='text-xs text-rose-600'>{errors.email?.message}</p>
                <button className='m-auto flex w-full flex-row place-content-evenly items-center rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'>
                    Sign in with Email
                </button>
            </form>
        </div>
    )
}

export default Forgot
