'use client'

import { BsEyeSlash, BsEye } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import axios from 'axios'

const schema = z
    .object({
        password: z
            .string()
            .min(1, { message: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters' }),
        newPassword: z
            .string()
            .min(1, { message: 'New Password is required' })
            .min(8, { message: 'New Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password is required' })
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Password don't match"
    })

type formValues = {
    password: string
    newPassword: string
    confirmPassword: string
}

interface ShowState {
    password: boolean
    newPassword: boolean
    confirmPassword: boolean
}

const ResetPassword = ({ params }: { params: { token: string } }) => {
    const [show, setShow] = useState({
        password: false,
        newPassword: false,
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

    const onSubmit = async ({ confirmPassword, ...result }: formValues) => {
        try {
            await axios.put(
                `/api/reset-password/${params.token}`,
                JSON.stringify(result)
            )
            toast.success('Password updated successfully')
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
                <p className='mb-5 self-center text-2xl'>Reset password</p>
                <label htmlFor='password' className='mb-2 text-sm'>
                    Password
                </label>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t ${
                            errors.password && 'input-invalid'
                        }`}
                        type={show.password ? 'text' : 'password'}
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
                <label htmlFor='newPassword' className='mb-2 text-sm'>
                    New Password
                </label>
                <div className='flex'>
                    <input
                        className={`w-full rounded-l border-b border-l border-t ${
                            errors.newPassword && 'input-invalid'
                        }`}
                        type={show.newPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        id='newPassword'
                        {...register('newPassword')}
                    />
                    <button
                        type='button'
                        onClick={() => handleClick('newPassword')}
                        className={`rounded-r border-b border-r border-t pr-3 ${
                            errors.newPassword
                                ? 'border-rose-600 bg-rose-200'
                                : 'border-gray-400 bg-gray-200'
                        }`}
                    >
                        {show.newPassword ? (
                            <BsEyeSlash className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        ) : (
                            <BsEye className='h-5 w-5 fill-gray-400 hover:opacity-80' />
                        )}
                    </button>
                </div>
                <p className='text-xs text-rose-600'>
                    {errors.newPassword?.message}
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
                    Reset password
                </button>
            </form>
        </div>
    )
}

export default ResetPassword
