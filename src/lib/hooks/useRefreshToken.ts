'use client'

import { signIn, useSession } from 'next-auth/react'
import axios from '../axios'

export const useRefreshToken = () => {
    const { data } = useSession()

    const refreshToken = async () => {
        const response = await axios.post(
            'https://oauth2.googleapis.com/token',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_ID as string,
                    client_secret: process.env.GOOGLE_SECRET as string,
                    grant_type: 'refresh_token' as string,
                    refresh_token: data?.user?.refreshToken as string
                })
            }
        )

        if (data) data.user.accessToken = response.data.access_token
        else signIn()
    }

    return refreshToken
}
