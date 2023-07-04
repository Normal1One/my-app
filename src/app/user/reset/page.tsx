'use client'

import { BsEyeSlash, BsEye } from 'react-icons/bs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast, Toaster } from 'react-hot-toast'
import { useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const schema = z.object({
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' }),
    newPassword: z
        .string()
        .min(8, { message: 'New Password must be at least 8 characters' })
})

type formValues = {
    password: string
    newPassword: string
}

interface ShowState {
    password: boolean
    newPassword: boolean
}

const Reset = () => {
    const { data } = useSession()
    const [show, setShow] = useState({
        password: false,
        newPassword: false
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

    const onSubmit = async (values: formValues) => {
        toast.promise(
            axios.post(
                '/api/reset',
                JSON.stringify({ ...values, id: data?.user.id })
            ),
            {
                loading: 'Saving...',
                success: <b>New password has been saved!</b>,
                error: <b>Could not save.</b>
            }
        )
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
                    <p className='mb-5 self-center text-2xl'>Reset password</p>
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
                                <BsEyeSlash className='h-5 w-5 fill-gray-500' />
                            ) : (
                                <BsEye className='h-5 w-5 fill-gray-500' />
                            )}
                        </button>
                    </div>
                    <p className='text-xs text-rose-600'>
                        {errors.password?.message}
                    </p>
                    <div className='flex'>
                        <input
                            className='w-full appearance-none rounded-l border-rose-600 p-3 leading-tight focus:outline-none aria-invalid:border-2 dark:bg-black'
                            type={show.newPassword ? 'text' : 'password'}
                            placeholder='New Password'
                            aria-invalid={errors.newPassword ? 'true' : 'false'}
                            {...register('newPassword')}
                        />
                        <button
                            type='button'
                            onClick={() => handleClick('newPassword')}
                            className='rounded-r bg-white pr-3 dark:bg-black'
                        >
                            {show.newPassword ? (
                                <BsEyeSlash className='h-5 w-5 fill-gray-500' />
                            ) : (
                                <BsEye className='h-5 w-5 fill-gray-500' />
                            )}
                        </button>
                    </div>
                    <p className='text-xs text-rose-600'>
                        {errors.newPassword?.message}
                    </p>
                    <button
                        className='m-auto w-full rounded bg-gray-500 pb-3 pt-3 font-bold text-white hover:opacity-80 focus:outline-none'
                        type='submit'
                    >
                        Reset password
                    </button>
                </form>
            </div>
        </section>
    )
}

export default Reset
