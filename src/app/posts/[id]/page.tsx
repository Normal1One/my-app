'use client'

import ConfirmationPopup from '@/components/ConfirmationPopup'
import Post from '@/components/Post'
import TextCenter from '@/components/ui/TextCenter'
import axios from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

const PostDetails = ({ params }: { params: { id: string } }) => {
    const getPost = async () => {
        const response = await axios.get(`/api/posts/${params.id}`)
        return response?.data
    }
    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['post'],
        queryFn: getPost
    })

    return (
        <>
            <ConfirmationPopup />
            <div className='mt-9'>
                {isError && <TextCenter text='Failed to fetch post' />}
                {isSuccess && <Post post={data} />}
                {isLoading && (
                    <p className='mb-4 w-full text-center text-lg'>
                        Loading...
                    </p>
                )}
            </div>
        </>
    )
}

export default PostDetails
