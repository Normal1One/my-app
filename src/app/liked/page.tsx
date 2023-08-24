import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'
import { AuthGetApi } from '@/lib/fetchAPI'

const Liked = () => {
    const allPosts = async ({
        take,
        lastCursor
    }: {
        take?: number
        lastCursor?: string
    }) => {
        'use server'
        const response = await AuthGetApi('api/posts/liked', {
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

export default Liked
