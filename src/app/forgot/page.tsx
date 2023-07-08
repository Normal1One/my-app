'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'

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
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ email }: formValues) => {
        try {
            await axios.post('/api/forgot', email)
            toast.success(`Email sent to ${email}`)
            router.push('/sign-in')
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
                <p className='mb-5 self-center text-2xl'>Email Reset Link</p>
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
                <button className='w-full rounded bg-gray-400 pb-3 pt-3 font-bold text-white hover:opacity-80'>
                    Submit
                </button>
                <p className='mt-2 self-center text-sm'>
                    {'Have an account? '}
                    <Link href='/sign-in' className='text-gray-400 underline'>
                        Sign In
                    </Link>
                </p>
                <p className='self-center text-sm'>
                    {"Don't have an account? "}
                    <Link href='/sign-in' className='text-gray-400 underline'>
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Forgot
