'use client'

import ConfirmationPopup from '@/components/ConfirmationPopup'
import Post from '@/components/Post'
import axios from '@/lib/axios'
import { PostWithAuthor } from '@/types/prismaTypes'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const Home = () => {
    const [open, setOpen] = useState(false)
    const [postId, setPostId] = useState('')
    const { ref, inView } = useInView()
    const allPosts = async ({
        take,
        lastCursor
    }: {
        take?: number
        lastCursor?: string
    }) => {
        const response = await axios.get('api/posts', {
            params: {
                take,
                lastCursor
            }
        })
        return response?.data
    }

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

    //TODO: Fix refresh token bug
    //TODO: Add posts listing

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
            <ConfirmationPopup
                open={open}
                postId={postId}
                data={data}
                setOpen={setOpen}
            />
            {isError && (
                <p className='mb-4 mt-9 w-full text-center text-lg'>
                    Failed to fetch posts
                </p>
            )}
            <ul className='mt-9'>
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
            </ul>
        </>
    )
}

export default Home
