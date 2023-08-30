import { AuthGetApi } from '@/lib/fetchAPI'
import type { Metadata } from 'next'
import PostDetails from './page'

interface Props {
    params: { id: string }
}

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const response = await AuthGetApi(`api/users/${params.id}`)

    return {
        title: response.name
    }
}

export default PostDetails
