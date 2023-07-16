import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

const refreshToken = async (refreshToken: string) => {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/refresh`, {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken
        })
    })
    const data = await response.json()

    return data.accessToken
}

export const AuthGetApi = async (url: string) => {
    const session = await getServerSession(authOptions)

    let response = await fetch(`${process.env.NEXTAUTH_URL}/${url}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session?.user.accessToken}`
        }
    })

    if (response.status == 401) {
        if (session)
            session.user.accessToken = await refreshToken(
                session?.user.refreshToken ?? ''
            )

        response = await fetch(`${process.env.NEXTAUTH_URL}/${url}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${session?.user.accessToken}`
            }
        })
        return await response.json()
    }

    return await response.json()
}
