import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'
import axios from '@/lib/axios'

interface Props {
    take?: number
    lastCursor?: string
}

const Home = () => {
    const getAllPosts = async ({ take, lastCursor }: Props) => {
        'use server'
        const response = await axios.get('api/posts', {
            params: {
                take,
                lastCursor
            }
        })
        return response?.data
    }
    return (
        <>
            <ConfirmationPopup />
            <div className='pt-32'>
                <PostsList getPosts={getAllPosts} queryName='posts' />
            </div>
        </>
    )
}

export default Home
