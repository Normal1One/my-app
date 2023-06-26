import { AuthGetApi } from '@/lib/fetchAPI';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

const User = async () => {
    const session = await getServerSession(authOptions);

    const response = await AuthGetApi(`api/user/${session?.user.id}`);

    return <div>{JSON.stringify(response)}</div>;
};

export default User;
