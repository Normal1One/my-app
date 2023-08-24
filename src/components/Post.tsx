'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { setOpen, setPostId } from '@/redux/slices/popupSlice'
import { PostWithAuthor } from '@/types/prismaTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsHeart, BsHeartFill, BsPerson, BsTrash } from 'react-icons/bs'
import { useDispatch } from 'react-redux'

interface Props {
    post: PostWithAuthor
}

const Post = ({ post }: Props) => {
    const [liked, setLiked] = useState(false)
    const { data } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const axiosAuth = useAxiosAuth()
    const queryClient = useQueryClient()
    const dispatch = useDispatch()

    const handleLike = async () => {
        if (data) {
            liked ? unlikeMutation.mutate() : likeMutation.mutate()
        } else {
            router.push('/sign-in')
        }
    }

    const likeMutation = useMutation({
        mutationFn: () => {
            return axiosAuth.put(`/api/posts/${post.id}/likes`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts'])
        },
        onError: (error, variables, context) => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        }
    })

    const unlikeMutation = useMutation({
        mutationFn: () => {
            return axiosAuth.delete(`/api/posts/${post.id}/likes`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['posts'])
        },
        onError: (error, variables, context) => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        }
    })

    const onClick = () => {
        dispatch(setOpen(true))
        dispatch(setPostId(post.id))
    }

    useEffect(() => {
        if (data?.user) {
            setLiked(post.likedByIDs.includes(data.user.id))
        }
    }, [data?.user, post.likedByIDs])

    return (
        <div className='m-auto mb-9 grid max-w-3xl grid-cols-2 justify-between gap-2 rounded border border-gray-400 p-3'>
            <Link
                className='flex w-fit items-center hover:opacity-70'
                href={`/users/${post.authorId}`}
            >
                {post.author.image ? (
                    <Image
                        alt={post.author.name || ''}
                        src={post.author.image}
                        width={16}
                        height={16}
                        className='mr-2 rounded-full'
                    />
                ) : (
                    <BsPerson className='mr-2 h-4 w-4' />
                )}
                {post.author.name}
            </Link>
            <p className='text-end text-gray-400'>
                {dayjs(post.createdAt).format('MMMM DD[,] YYYY [at] h:mm A')}
            </p>
            {pathname.includes('posts') ? (
                <div className='col-span-2 row-start-2'>
                    <p className='mb-2 text-xl font-bold'>{post.title}</p>
                    <p className='mb-2'>{post.subtitle}</p>
                    <p className='col-span-2 row-start-3'>{post.text}</p>
                </div>
            ) : (
                <Link
                    href={`/posts/${post.id}`}
                    className='col-span-2 row-start-2'
                >
                    <p className='mb-2 text-xl font-bold'>{post.title}</p>
                    <p>{post.subtitle}</p>
                </Link>
            )}
            <button
                type='submit'
                onClick={handleLike}
                className='flex w-fit items-center hover:opacity-70'
            >
                {liked ? <BsHeartFill /> : <BsHeart />}
                <p className='ml-2'>{post.likedByIDs.length}</p>
            </button>
            {data?.user.id === post.authorId && (
                <button
                    type='submit'
                    onClick={onClick}
                    className='w-fit place-self-end self-center hover:opacity-70'
                >
                    <BsTrash />
                </button>
            )}
        </div>
    )
}

export default Post
