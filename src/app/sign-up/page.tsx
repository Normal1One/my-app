'use client'

import Button from '@/components/ui/Button'
import Form from '@/components/ui/Form'
import InputGroup from '@/components/ui/InputGroup'
import PasswordInputGroup from '@/components/ui/PasswordInputGroup'
import SocialLoginButtons from '@/components/ui/SocialLoginButtons'
import TextCenter from '@/components/ui/TextCenter'
import TextLink from '@/components/ui/TextLink'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { isAxiosError } from 'axios'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

const schema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().min(1, { message: 'Email is required' }).email({
            message: 'Must be a valid email'
        }),
        password: z
            .string()
            .min(1, { message: 'Password is required' })
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Confirm Password is required' })
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Password don't match"
    })

type formValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

interface ShowState {
    password: boolean
    confirmPassword: boolean
}

const SignUp = () => {
    const [show, setShow] = useState({
        password: false,
        confirmPassword: false
    })
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState<string>()
    const handleClick = (item: keyof ShowState) =>
        setShow((prevState) => ({ ...prevState, [item]: !prevState[item] }))
    const [isLoading, setLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<formValues>({
        resolver: zodResolver(schema)
    })

    const onSubmit = async ({ confirmPassword, ...values }: formValues) => {
        try {
            setLoading(true)
            await axios.post('/api/users', JSON.stringify(values))
            await signIn('email', {
                redirect: false,
                callbackUrl: '/',
                email: values.email
            })
            setEmail(values.email)
            setSuccess(true)
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

    if (success) {
        return (
            <TextCenter
                text={`Verification email has been sent to ${email}, please check your
            email`}
            />
        )
    }

    return (
        <div className='flex h-screen'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <p className='mb-5 self-center text-2xl'>Sign Up</p>
                <InputGroup
                    type='text'
                    text='Name'
                    placeholder='J Smith'
                    id='name'
                    isError={errors.name}
                    register={register('name')}
                />
                <InputGroup
                    type='email'
                    text='Email'
                    placeholder='jsmith@example.com'
                    id='email'
                    isError={errors.email}
                    register={register('email')}
                />
                <PasswordInputGroup
                    isHidden={show.password}
                    text='Password'
                    id='password'
                    isError={errors.password}
                    register={register('password')}
                    handleClick={() => handleClick('password')}
                />
                <PasswordInputGroup
                    isHidden={show.confirmPassword}
                    text='Confirm Password'
                    id='confirmPassword'
                    isError={errors.confirmPassword}
                    register={register('confirmPassword')}
                    handleClick={() => handleClick('confirmPassword')}
                />
                <Button isLoading={isLoading} />
                <SocialLoginButtons />
                <TextLink
                    text='Have an account? '
                    linkText='Sign In'
                    link='/sign-in'
                />
            </Form>
        </div>
    )
}

export default SignUp
