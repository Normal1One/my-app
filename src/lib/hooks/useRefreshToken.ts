'use client'

import { signIn, useSession } from 'next-auth/react'
import axios from '../axios'

export const useRefreshToken = () => {
    const { data } = useSession()

    const refreshToken = async () => {
        const response = await axios.post('/api/refresh', {
            refresh: data?.user.refreshToken
        })

        if (data) data.user.accessToken = response.data.accessToken
        else signIn()
    }

    return refreshToken
}
