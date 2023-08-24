'use client'

import { PostWithAuthor } from '@/types/prismaTypes'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Post from './Post'

interface Props {
    allPosts: ({}) => Promise<any>
}

const PostsList = ({ allPosts }: Props) => {
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

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    return (
        <ul>
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
            {isError && (
                <p className='mb-4 mt-9 w-full text-center text-lg'>
                    Failed to fetch posts
                </p>
            )}
        </ul>
    )
}

export default PostsList
