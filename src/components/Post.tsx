'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BsHeart, BsHeartFill, BsPerson, BsTrash } from 'react-icons/bs'

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

const Post = ({ post }: { post: PostWithAuthor }) => {
    const [liked, setLiked] = useState(false)
    const [show, setShow] = useState(true)
    const { data } = useSession()
    const router = useRouter()
    const axiosAuth = useAxiosAuth()

    const handleLike = async () => {
        if (data) {
            if (liked) {
                await axiosAuth.delete(`api/posts/${post.id}/likes`)
                post.likedByIDs = post.likedByIDs.filter(
                    (id) => id !== data.user.id
                )
            } else {
                await axiosAuth.put(`api/posts/${post.id}/likes`)
                post.likedByIDs.push(data.user.id)
            }
            setLiked(!liked)
        } else {
            router.push('/sign-in')
        }
    }

    const handleDelete = async () => {
        await axiosAuth.delete(`api/posts/${post.id}`)
        setShow(false)
    }

    useEffect(() => {
        if (data?.user) {
            setLiked(post.likedByIDs.includes(data.user.id))
        }
    }, [data?.user, post.likedByIDs])

    if (!show) return

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
            <p className='col-span-2 text-xl font-bold'>{post.title}</p>
            <p className='col-span-2 row-start-3'>{post.subtitle}</p>
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
                    onClick={handleDelete}
                    className='w-fit place-self-end self-center hover:opacity-70'
                >
                    <BsTrash />
                </button>
            )}
        </div>
    )
}

export default Post
