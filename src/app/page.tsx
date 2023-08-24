import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'
import axios from '@/lib/axios'

const Home = () => {
    const allPosts = async ({
        take,
        lastCursor
    }: {
        take?: number
        lastCursor?: string
    }) => {
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
                <PostsList allPosts={allPosts} />
            </div>
        </>
    )
}

export default Home
