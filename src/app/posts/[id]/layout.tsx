import axios from '@/lib/axios'
import type { Metadata } from 'next'
import PostDetails from './page'

interface Props {
    params: { id: string }
}

export const generateMetadata = async ({
    params
}: Props): Promise<Metadata> => {
    const response = await axios.get(`/api/posts/${params.id}`)

    return {
        title: response.data.title
    }
}

export default PostDetails
