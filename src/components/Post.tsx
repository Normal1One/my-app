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
import { toast } from 'react-hot-toast'
import { BsHeart, BsHeartFill, BsPerson, BsTrash } from 'react-icons/bs'
import { useDispatch } from 'react-redux'

interface Props {
    post: PostWithAuthor
}

const Post = ({ post }: Props) => {
    const { data } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const axiosAuth = useAxiosAuth()
    const dispatch = useDispatch()

    const handleLike = async () => {
        if (data?.user) {
            post.likedByIDs.includes(data.user.id)
                ? unlikeMutation.mutate()
                : likeMutation.mutate()
        } else {
            router.push('/sign-in')
        }
    }

    const likeMutation = useMutation({
        mutationFn: () => {
            return axiosAuth.put(`/api/posts/${post.id}/likes`)
        },
        onMutate: () => {
            if (data) post.likedByIDs.push(data.user.id)
        },
        onError: (error, _variables, _context) => {
            post.likedByIDs = post.likedByIDs.filter(
                (id) => id !== data?.user.id
            )
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
        onMutate: () => {
            post.likedByIDs = post.likedByIDs.filter(
                (id) => id !== data?.user.id
            )
        },
        onError: (error, _variables, _context) => {
            if (data) post.likedByIDs.push(data.user.id)
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
                {data?.user && post.likedByIDs.includes(data.user.id) ? (
                    <BsHeartFill />
                ) : (
                    <BsHeart />
                )}
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
