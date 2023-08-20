'use client'

import PasswordResetForm from '@/components/PasswordResetForm'
import axios, { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type formValues = {
    newPassword: string
    confirmPassword: string
}

const Reset = ({ params }: { params: { token: string } }) => {
    const [isLoading, setLoading] = useState(false)
    const onSubmit = async ({ newPassword }: formValues) => {
        try {
            setLoading(true)
            const response = await axios.put(`/api/reset/${params.token}`, {
                newPassword
            })
            toast.success(response.data)
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

export default Reset
