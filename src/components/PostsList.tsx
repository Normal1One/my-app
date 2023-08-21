'use client'

import { PostWithAuthor } from '@/types/prismaTypes'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Post from './Post'
import ConfirmationPopup from './ConfirmationPopup'

const PostsList = ({ allPosts }: { allPosts: any }) => {
    const [open, setOpen] = useState(false)
    const [postId, setPostId] = useState('')
    const { ref, inView } = useInView()
    const {
        data,
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isSuccess,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryFn: ({ pageParam = '' }) =>
            allPosts({ take: 10, lastCursor: pageParam }),
        queryKey: ['posts'],
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData.lastCursor
        }
    })

    const deleteHandler = (id: string) => {
        setPostId(id)
        setOpen(true)
    }

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    return (
        <>
            <ConfirmationPopup open={open} postId={postId} setOpen={setOpen} />
            <ul>
                {isSuccess &&
                    data?.pages.map(
                        (page) =>
                            page.data &&
                            page.data.map(
                                (post: PostWithAuthor, index: number) => {
                                    if (page.data.length === index + 1) {
                                        return (
                                            <li ref={ref} key={index}>
                                                <Post
                                                    post={post}
                                                    deleteHandler={
                                                        deleteHandler
                                                    }
                                                />
                                            </li>
                                        )
                                    } else {
                                        return (
                                            <li key={post.id}>
                                                <Post
                                                    post={post}
                                                    deleteHandler={
                                                        deleteHandler
                                                    }
                                                />
                                            </li>
                                        )
                                    }
                                }
                            )
                    )}
                {(isLoading || isFetchingNextPage) && (
                    <p className='mb-4 w-full text-center text-lg'>
                        Loading...
                    </p>
                )}
                {isError && (
                    <p className='mb-4 mt-9 w-full text-center text-lg'>
                        Failed to fetch posts
                    </p>
                )}
            </ul>
        </>
    )
}

export default PostsList
