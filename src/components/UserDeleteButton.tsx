'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { signOut } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const UserDeleteButton = () => {
    const axiosAuth = useAxiosAuth()

    const onDelete = async () => {
        try {
            const response = await axiosAuth.delete('/api/users/me')
            toast.success(response.data)
            signOut({
                callbackUrl: '/'
            })
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <button
            className='mt-1 rounded bg-rose-600 p-1 pl-2 pr-2 hover:opacity-70'
            onClick={onDelete}
        >
            Delete account
        </button>
    )
}

export default UserDeleteButton
