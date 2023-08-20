'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { PostWithAuthor } from '@/types/prismaTypes'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { MouseEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'
import Button from './Button'
import { usePathname, useRouter } from 'next/navigation'

const ConfirmationPopup = ({
    open,
    postId,
    data,
    setOpen
}: {
    open: boolean
    postId: string
    data?: InfiniteData<any>
    setOpen: (arg0: boolean) => void
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const axiosAuth = useAxiosAuth()
    const queryClient = useQueryClient()

    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setOpen(false)
        }
    }

    const deletePost = async () => {
        try {
            setLoading(true)
            const response = await axiosAuth.delete(`/api/posts/${postId}`)
            toast.success(response.data)
            if (pathname.includes('posts')) router.push('/')
            if (data) {
                const newData = data?.pages.map((page) => ({
                    ...page,
                    data: page.data.filter(
                        (post: PostWithAuthor) => post.id !== postId
                    )
                }))
                queryClient.setQueryData(['posts'], { pages: newData })
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    if (!open) return

    return (
        <div
            className='fixed z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40'
            onClick={(event) => handleClick(event)}
        >
            <div className='relative w-[360px] rounded bg-white p-5' ref={ref}>
                <BsX
                    className='absolute right-2 top-2 h-8 w-8 cursor-pointer hover:opacity-70'
                    onClick={() => setOpen(false)}
                />
                <p className='mb-5 text-center text-lg'>Are you sure?</p>
                <Button isLoading={loading} onClick={deletePost} />
            </div>
        </div>
    )
}

export default ConfirmationPopup
