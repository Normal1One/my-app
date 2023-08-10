'use client'

import Button from '@/components/Button'
import Header from '@/components/Header'
import PasswordButton from '@/components/PasswordButton'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z
    .object({
        password: z.string().min(1, { message: 'Password is required' }),
        newPassword: z
            .string()
            .min(1, { message: 'New Password is required' })
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password is required' })
    })
    .partial()
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

const UpdatePassword = () => {
    const axiosAuth = useAxiosAuth()
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
    const onSubmit = async ({ confirmPassword, ...values }: formValues) => {
        try {
            const response = await axiosAuth.post(
                '/api/update-password',
                values
            )
            toast.success(response.data)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        }
    }

    return (
        <section>
            <Header />
            <div className='flex h-[calc(100vh-64px)]'>
                <form
                    className='m-auto flex w-96 flex-col gap-2'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <p className='mb-5 self-center text-2xl'>Update password</p>
                    <label htmlFor='password' className='mb-2 text-sm'>
                        Old Password
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
                    <label htmlFor='newPassword' className='mb-2 text-sm'>
                        New Password
                    </label>
                    <div className='flex'>
                        <input
                            className={`w-full rounded-l border-b border-l border-t border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                                errors.newPassword &&
                                'border-rose-600 bg-rose-200 placeholder-rose-600'
                            }`}
                            type={show.newPassword ? 'text' : 'password'}
                            autoComplete='new-password'
                            placeholder='••••••••'
                            id='newPassword'
                            {...register('newPassword')}
                        />
                        <PasswordButton
                            isHidden={show.newPassword}
                            isInvalid={errors.newPassword}
                            handleClick={() => handleClick('newPassword')}
                        />
                    </div>
                    <p className='text-xs text-rose-600'>
                        {errors.newPassword?.message}
                    </p>
                    <label htmlFor='password' className='mb-2 text-sm'>
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
                    <Button text='Update' />
                </form>
            </div>
        </section>
    )
}

export default UpdatePassword
