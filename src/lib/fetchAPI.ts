import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const BASE_URL = 'http://localhost:3000';

const refreshToken = async (refreshToken: string) => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({
            refresh: refreshToken,
        }),
    });
    const data = await response.json();
    console.log({ data });

    return data.accessToken;
};

export const AuthGetApi = async (url: string) => {
    const session = await getServerSession(authOptions);

    let response = await fetch(`${BASE_URL}/${url}`, {
        method: 'GET',
        headers: {
            Authorization: session?.user.accessToken || '',
        },
    });

    if (response.status == 401) {
        if (session)
            session.user.accessToken = await refreshToken(
                session?.user.refreshToken ?? ''
            );

        response = await fetch(`${BASE_URL}/${url}`, {
            method: 'GET',
            headers: {
                Authorization: session?.user.accessToken || '',
            },
        });
        return await response.json();
    }

    return await response.json();
};
