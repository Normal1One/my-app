'use client'

import useAxiosAuth from '@/lib/hooks/useAxiosAuth'
import { selectPopupState, setOpen } from '@/redux/slices/popupSlice'
import { PostWithAuthor } from '@/types/prismaTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { MouseEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import Button from './ui/Button'

interface PaginatedPosts {
    pages: {
        data: PostWithAuthor[]
    }[]
    pageParams: null | string
}

const ConfirmationPopup = () => {
    const ref = useRef<HTMLDivElement>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const axiosAuth = useAxiosAuth()
    const queryClient = useQueryClient()
    const popupState = useSelector(selectPopupState)
    const dispatch = useDispatch()

    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            dispatch(setOpen(false))
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            const response = await axiosAuth.delete(
                `/api/posts/${popupState.postId}`
            )
            toast.success(response.data)
            if (pathname.includes('posts')) router.push('/')
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data)
            } else {
                toast.error('Something went wrong')
            }
        } finally {
            setLoading(false)
            dispatch(setOpen(false))
        }
    }

    const mutation = useMutation({
        mutationFn: onDelete,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['posts'] })
            const previousPosts = queryClient.getQueryData<PaginatedPosts>([
                'posts'
            ])
            queryClient.setQueryData(['posts'], {
                pages: previousPosts?.pages.map((page: any) => ({
                    ...page,
                    data: page.data?.filter(
                        (post: PostWithAuthor) => post.id !== popupState.postId
                    )
                })),
                pageProps: previousPosts?.pageParams
            })
            return { previousPosts }
        },
        onError: (error, variables, context) => {
            queryClient.setQueryData(['posts'], context?.previousPosts)
        },
        onSettled: () => {
            queryClient.invalidateQueries()
        }
    })

    if (!popupState.open) return

    return (
        <div
            className='fixed z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40'
            onClick={(event) => handleClick(event)}
        >
            <div className='relative w-[360px] rounded bg-white p-5' ref={ref}>
                <BsX
                    className='absolute right-2 top-2 h-8 w-8 cursor-pointer hover:opacity-70'
                    onClick={() => dispatch(setOpen(false))}
                />
                <p className='mb-5 text-center text-lg'>Are you sure?</p>
                <Button isLoading={loading} onClick={() => mutation.mutate()} />
            </div>
        </div>
    )
}

export default ConfirmationPopup
