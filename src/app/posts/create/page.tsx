'use client'

import Header from '@/components/Header'
import Button from '@/components/ui/Button'
import Form from '@/components/ui/Form'
import InputGroup from '@/components/ui/InputGroup'
import TextareaGroup from '@/components/ui/TextareaGroup'
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
        <>
            <Header />
            <div className='flex h-[calc(100vh-64px)]'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <p className='mb-5 self-center text-2xl'>Create Post</p>
                    <InputGroup
                        type='text'
                        text='Title'
                        id='title'
                        isError={errors.title}
                        register={register('title')}
                    />
                    <InputGroup
                        type='text'
                        text='Subtitle'
                        id='subtitle'
                        isError={errors.subtitle}
                        register={register('subtitle')}
                    />
                    <TextareaGroup
                        text='Text'
                        id='text'
                        isError={errors.text}
                        register={register('text')}
                    />
                    <Button isLoading={isLoading} />
                </Form>
            </div>
        </>
    )
}

export default Create
