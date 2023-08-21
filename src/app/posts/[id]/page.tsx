'use client'

import ConfirmationPopup from '@/components/ConfirmationPopup'
import Post from '@/components/Post'
import axios from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const PostDetails = ({ params }: { params: { id: string } }) => {
    const [open, setOpen] = useState(false)
    const [postId, setPostId] = useState('')
    const getPost = async () => {
        const response = await axios.get(`/api/posts/${params.id}`)
        return response?.data
    }
    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['post'],
        queryFn: getPost
    })

    const deleteHandler = (id: string) => {
        setPostId(id)
        setOpen(true)
    }

    return (
        <>
            <ConfirmationPopup open={open} postId={postId} setOpen={setOpen} />
            <div className='mt-9'>
                {isError && (
                    <div className='absolute top-1/2 w-full text-center text-lg'>
                        Failed to fetch post
                    </div>
                )}
                {isSuccess && (
                    <Post post={data} deleteHandler={deleteHandler} />
                )}
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
