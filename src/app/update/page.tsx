'use client'

import Button from '@/components/Button'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { BsPerson } from 'react-icons/bs'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    })
})

type formValues = {
    name: string
    email: string
}

const Update = () => {
    const [file, setFile] = useState<File>()
    const [defaultValuesSet, setDefaultValuesSet] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const { data, update } = useSession()
    const axiosAuth = useAxiosAuth()
    const ref = useRef<HTMLInputElement>(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })
    const onSubmit = async (values: formValues) => {
        try {
            setLoading(true)
            const response = await axiosAuth.patch(
                '/api/users/me',
                { file, ...values },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            if (ref.current?.value) {
                ref.current.value = ''
            }
            await update({
                image: response.data.image,
                email: response.data.email,
                name: response.data.name
            })
            toast.success('User updated successfully')
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

    useEffect(() => {
        if (!defaultValuesSet && data) {
            reset({
                name: data.user.name as string,
                email: data.user.email as string
            })
            setDefaultValuesSet(true)
        }
    }, [data, defaultValuesSet, reset])

    return (
        <div className='flex h-[calc(100vh-64px)] align-middle'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Update user</p>
                <p className='mb-2 text-sm'>Image</p>
                <div className='flex justify-between'>
                    {data?.user.image && data?.user.name ? (
                        <Image
                            src={data?.user.image}
                            alt={data?.user.name}
                            width={48}
                            height={48}
                            className='mr-7 rounded-full'
                        />
                    ) : (
                        <BsPerson className='mr-7 h-12 w-12' />
                    )}
                    <input
                        type='file'
                        accept='image/*'
                        className='w-full self-center rounded border border-gray-400 bg-gray-200 p-1.5 text-sm transition file:cursor-pointer file:appearance-none file:rounded file:border-none file:bg-gray-400 file:p-2 file:text-white file:hover:opacity-70'
                        onChange={(e) => setFile(e.target.files?.[0])}
                        ref={ref}
                    />
                </div>
                <label htmlFor='name' className='mb-2 text-sm'>
                    Name
                </label>
                <input
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.name &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
                    }`}
                    type='text'
                    placeholder='J Smith'
                    id='name'
                    {...register('name')}
                />
                <p className='text-xs text-rose-600'>{errors.name?.message}</p>
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
                <Button isLoading={isLoading} />
            </form>
        </div>
    )
}

export default Update
