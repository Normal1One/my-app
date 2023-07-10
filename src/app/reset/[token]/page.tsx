'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import axios, { AxiosError, isAxiosError } from 'axios'
import PasswordButton from '@/components/PasswordButton'
import Button from '@/components/Button'

const schema = z
    .object({
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
    newPassword: string
    confirmPassword: string
}

interface ShowState {
    newPassword: boolean
    confirmPassword: boolean
}

const Reset = ({ params }: { params: { token: string } }) => {
    const [show, setShow] = useState({
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
            const response = await axios.put(
                `/api/reset/${params.token}`,
                JSON.stringify(result)
            )
            toast.success(response.data)
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            }
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
                        placeholder='••••••••'
                        autoComplete='new-password'
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
                <Button text='Reset password' />
            </form>
        </div>
    )
}

export default Reset
