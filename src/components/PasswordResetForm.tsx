import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from './ui/Button'
import PasswordInputGroup from './ui/PasswordInputGroup'

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

const PasswordResetForm = ({
    onSubmit,
    isLoading
}: {
    onSubmit: (arg0: formValues) => Promise<void>
    isLoading: boolean
}) => {
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

    return (
        <form
            className='m-auto flex w-96 flex-col gap-2'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <p className='mb-5 self-center text-2xl'>Reset password</p>
            <PasswordInputGroup
                isHidden={show.newPassword}
                text='New Password'
                id='password'
                isError={errors.newPassword}
                register={register('newPassword')}
                handleClick={() => handleClick('newPassword')}
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
        </form>
    )
}

export default PasswordResetForm
