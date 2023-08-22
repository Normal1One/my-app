import ConfirmationPopup from '@/components/ConfirmationPopup'
import Header from '@/components/Header'
import PostsList from '@/components/PostsList'
import axios from '@/lib/axios'

const Liked = () => {
    const allPosts = async ({
        take,
        lastCursor
    }: {
        take?: number
        lastCursor?: string
    }) => {
        'use server'
        const response = await axios.get('api/posts/liked', {
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
            <Header />
            <div className='pt-32'>
                <PostsList allPosts={allPosts} />
            </div>
        </>
    )
}

export default Liked
