'use client'

import { PostWithAuthor } from '@/types/prismaTypes'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Post from './Post'
import { usePathname } from 'next/navigation'
import { getAllPosts, getLikedPosts, getPostsByAuthor } from '@/lib/posts'

const PostsList = ({ userId }: { userId?: string }) => {
    const { ref, inView } = useInView()
    const pathname = usePathname()
    const {
        data: allPosts,
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isSuccess,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryFn: ({ pageParam = '' }) =>
            getAllPosts({ take: 10, lastCursor: pageParam }),
        queryKey: ['posts'],
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData.lastCursor
        }
    })
    const { data: likedPosts } = useInfiniteQuery({
        queryFn: async ({ pageParam = '' }) =>
            getLikedPosts({ take: 10, lastCursor: pageParam }),
        queryKey: ['likedPosts'],
        enabled: !!allPosts,
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData.lastCursor
        }
    })

    const { data: postsByAuthor } = useInfiniteQuery({
        queryFn: async ({ pageParam = '' }) =>
            getPostsByAuthor({ take: 10, lastCursor: pageParam, userId }),
        queryKey: ['postsByAuthor', userId],
        enabled: !!allPosts,
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData.lastCursor
        }
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, inView, fetchNextPage])

    const posts = pathname.includes('liked')
        ? likedPosts
        : pathname.includes('users')
        ? postsByAuthor
        : allPosts

    return (
        <ul>
            {isSuccess &&
                posts?.pages.map((page) =>
                    page?.data?.map((post: PostWithAuthor, index: number) => {
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
                <p className='mb-4 w-full pt-32 text-center text-lg'>
                    Failed to fetch posts
                </p>
            )}
        </ul>
    )
}

export default PostsList
