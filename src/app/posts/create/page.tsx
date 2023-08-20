'use client'

import Button from '@/components/Button'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    subtitle: z.string().min(1, { message: 'Subtitle is required' }),
    text: z.string().min(1, { message: 'Text is required' })
})

type formValues = {
    title: string
    subtitle: string
    text: string
}

const Create = () => {
    const axiosAuth = useAxiosAuth()
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const onSubmit = async (values: formValues) => {
        try {
            setLoading(true)
            await axiosAuth.post('/api/posts', values)
            toast.success('Post created successfully!')
            router.push('/')
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
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    return (
        <div className='flex h-[calc(100vh-64px)]'>
            <form
                className='m-auto flex w-96 flex-col gap-2'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className='mb-5 self-center text-2xl'>Create Post</p>
                <label htmlFor='title' className='mb-2 text-sm'>
                    Title
                </label>
                <input
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.title &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
                    }`}
                    type='text'
                    id='title'
                    {...register('title')}
                />
                <p className='text-xs text-rose-600'>{errors.title?.message}</p>
                <label htmlFor='subtitle' className='mb-2 text-sm'>
                    Subtitle
                </label>
                <input
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.subtitle &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
                    }`}
                    type='text'
                    id='subtitle'
                    {...register('subtitle')}
                />
                <p className='text-xs text-rose-600'>
                    {errors.subtitle?.message}
                </p>
                <label htmlFor='text' className='mb-2 text-sm'>
                    Text
                </label>
                <textarea
                    className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                        errors.text &&
                        'border-rose-600 bg-rose-200 placeholder-rose-600'
                    }`}
                    rows={10}
                    cols={50}
                    id='text'
                    {...register('text')}
                />
                <p className='text-xs text-rose-600'>{errors.text?.message}</p>
                <Button isLoading={isLoading} />
            </form>
        </div>
    )
}

export default Create
