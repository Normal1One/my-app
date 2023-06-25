'use client';

import axios from 'axios';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

async function getUser(session: Session) {
    const response = await axios.get(
        `http://localhost:3000/api/user/${session.user.id}`,
        { headers: { accessToken: session.user.accessToken } }
    );
    return response;
}

export default async function User() {
    const { data: session } = useSession();

    if (!session) {
        return <p>You should be authorized</p>;
    }

    const data = await getUser(session);

    return <p>{JSON.stringify(data)}</p>;
}
