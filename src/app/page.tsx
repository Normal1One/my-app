'use client'

import ConfirmationPopup from '@/components/ConfirmationPopup'
import Header from '@/components/Header'
import Post from '@/components/Post'
import axios from '@/lib/axios'
import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Prisma } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'

type PostWithAuthor = Prisma.PostGetPayload<{
    include: {
        author: {
            select: {
                name: true
                image: true
            }
        }
    }
}>

const Home = () => {
    const [open, setOpen] = useState(false)
    const [postId, setPostId] = useState('')
    const [loading, setLoading] = useState(false)
    // const [show, setShow] = useState(true)
    const axiosAuth = useAxiosAuth()
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
        error,
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

    const deleteHandler = async (id: string) => {
        setPostId(id)
        setOpen(true)
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const response = await axiosAuth.delete(`api/posts/${postId}`)
            toast.success(response.data)
        } catch (error) {
            toast.error('Something went wrong!')
        } finally {
            setLoading(false)
            setOpen(false)
            // setShow(false)
        }
    }

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    //TODO: Add Post invalidation
    //TODO: Add Post page
    //TODO: Add Post creating page
    //TODO: Fix Post deleting from users

    return (
        <>
            <ConfirmationPopup
                open={open}
                loading={loading}
                setOpen={setOpen}
                onDelete={handleDelete}
            />
            <Header />
            {error && (
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
                                                    // show={show}
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
                                                    // show={show}
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
