import { AuthGetApi } from '@/lib/fetchAPI';

const User = async ({ params }: { params: { id: string } }) => {
    const response = await AuthGetApi(`api/user/${params.id}`);

    return <div>{JSON.stringify(response)}</div>;
};

export default User;
