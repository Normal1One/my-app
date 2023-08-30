import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'
import { AuthGetApi } from '@/lib/fetchAPI'

const Liked = () => {
    const allPosts = async () => {
        'use server'
        const response = await AuthGetApi('api/posts/liked')
        return response
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
