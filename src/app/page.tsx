'use client'

import Post from '@/components/Post'
import axios from '@/lib/axios'
import { Prisma } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
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

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    if (error)
        return (
            <p className='mb-4 mt-9 w-full text-center text-lg'>
                Failed to fetch posts
            </p>
        )

    return (
        <ul className='mt-9'>
            {isSuccess &&
                data?.pages.map(
                    (page) =>
                        page.data &&
                        page.data.map((post: PostWithAuthor, index: number) => {
                            if (page.data.length === index + 1) {
                                return (
                                    <li ref={ref} key={index}>
                                        <Post post={post} />
                                    </li>
                                )
                            } else {
                                return (
                                    <li key={post.id}>
                                        <Post post={post} />
                                    </li>
                                )
                            }
                        })
                )}
            {(isLoading || isFetchingNextPage) && (
                <p className='mb-4 w-full text-center text-lg'>Loading...</p>
            )}
        </ul>
    )
}

export default Home
