'use client'

import Button from '@/components/Button'
import axios from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    })
})

type formValues = {
    email: string
}

const Forgot = () => {
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ email }: formValues) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/forgot', { email })
            toast.success(response.data)
            router.push('/sign-in')
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

    return (
        <div className='flex h-screen'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Email Reset Link</p>
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
                    id='email'
                    {...register('email')}
                ></input>
                <p className='text-xs text-rose-600'>{errors.email?.message}</p>
                <Button isLoading={isLoading} />
                <p className='mt-2 self-center text-sm'>
                    {'Have an account? '}
                    <Link
                        href='/sign-in'
                        className='text-gray-400 underline hover:opacity-70'
                    >
                        Sign In
                    </Link>
                </p>
                <p className='self-center text-sm'>
                    {"Don't have an account? "}
                    <Link
                        href='/sign-up'
                        className='text-gray-400 underline hover:opacity-70'
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Forgot
