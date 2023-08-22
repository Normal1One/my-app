'use client'

import Button from '@/components/ui/Button'
import Form from '@/components/ui/Form'
import InputGroup from '@/components/ui/InputGroup'
import TextLink from '@/components/ui/TextLink'
import axios from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                <p className='mb-5 self-center text-2xl'>Email Reset Link</p>
                <InputGroup
                    type='email'
                    text='Email'
                    placeholder='jsmith@example.com'
                    id='email'
                    isError={errors.email}
                    register={register('email')}
                />
                <Button isLoading={isLoading} />
                <TextLink
                    text='Have an account? '
                    linkText='Sign In'
                    link='/sign-in'
                />
                <TextLink
                    text="Don't have an account? "
                    linkText='Sign Up'
                    link='/sign-up'
                />
            </Form>
        </div>
    )
}

export default Forgot
