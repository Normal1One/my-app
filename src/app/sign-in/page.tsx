'use client'

import Button from '@/components/ui/Button'
import Form from '@/components/ui/Form'
import InputGroup from '@/components/ui/InputGroup'
import PasswordInputGroup from '@/components/ui/PasswordInputGroup'
import SocialLoginButtons from '@/components/ui/SocialLoginButtons'
import TextLink from '@/components/ui/TextLink'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({
        message: 'Must be a valid email'
    }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(8, { message: 'Password must be at least 8 characters' })
})

type formValues = {
    email: string
    password: string
}

const SignIn = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: formValues) => {
        setLoading(true)
        await signIn('credentials', { ...data, redirect: false }).then(
            (callback) => {
                if (callback?.error) {
                    switch (callback.error.split(' ').pop()) {
                        case '401': {
                            toast.error('Incorrect password')
                            break
                        }
                        case '404': {
                            toast.error('No user found')
                            break
                        }
                        default: {
                            toast.error('Something went wrong')
                        }
                    }
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('Signed in successfully')
                    router.push('/')
                }
            }
        )
        setLoading(false)
    }

    return (
        <div className='flex h-screen'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <p className='mb-5 self-center text-2xl'>Sign In</p>
                <InputGroup
                    type='email'
                    text='Email'
                    placeholder='jsmith@example.com'
                    id='email'
                    isError={errors.email}
                    register={register('email')}
                />
                <PasswordInputGroup
                    isHidden={show}
                    text='Password'
                    id='password'
                    isError={errors.password}
                    register={register('password')}
                    handleClick={() => handleClick()}
                    rest={
                        <Link
                            href='/forgot'
                            className='w-max text-sm text-gray-400'
                        >
                            Forgot Password?
                        </Link>
                    }
                />
                <Button isLoading={isLoading} />
                <SocialLoginButtons />
                <TextLink
                    text="Don't have an account? "
                    linkText='Sign Up'
                    link='/sign-up'
                />
            </Form>
        </div>
    )
}

export default SignIn
