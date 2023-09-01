import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'

const Home = () => {
    return (
        <>
            <ConfirmationPopup />
            <div className='pt-32'>
                <PostsList />
            </div>
        </>
    )
}

export default Home
