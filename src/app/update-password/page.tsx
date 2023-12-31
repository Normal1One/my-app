'use client'

import PasswordResetForm from '@/components/PasswordResetForm'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type formValues = {
    newPassword: string
    confirmPassword: string
}

const UpdatePassword = () => {
    const axiosAuth = useAxiosAuth()
    const [isLoading, setLoading] = useState(false)
    const onSubmit = async ({ newPassword }: formValues) => {
        try {
            setLoading(true)
            await axiosAuth.patch(
                '/api/users/me',
                { newPassword },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            toast.success('User updated successfully!')
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
            <PasswordResetForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
    )
}

export default UpdatePassword
