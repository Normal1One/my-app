'use client';

import { signIn, useSession } from 'next-auth/react';
import axios from '../axios';

export const useRefreshToken = () => {
    const { data: session } = useSession();

    const refreshToken = async () => {
        const response = await axios.post('/auth/refresh', {
            refresh: session?.user.refreshToken,
        });

        if (session) session.user.accessToken = response.data.accessToken;
        else signIn();
    };

    return refreshToken;
};
