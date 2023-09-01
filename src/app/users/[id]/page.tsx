import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ConfirmationPopup from '@/components/ConfirmationPopup'
import PostsList from '@/components/PostsList'
import Popper from '@/components/ui/Popper'
import TextCenter from '@/components/ui/TextCenter'
import UserDeleteButton from '@/components/ui/UserDeleteButton'
import axios from '@/lib/axios'
import { AuthGetApi } from '@/lib/fetchAPI'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'

interface Props {
    take?: number
    lastCursor?: string
}

const User = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions)
    const response = await AuthGetApi(`api/users/${params.id}`)

    const getPostsByAuthor = async ({ take, lastCursor }: Props) => {
        'use server'
        const response = await axios.get(`api/users/${params.id}/posts`, {
            params: {
                take,
                lastCursor
            }
        })
        return response?.data
    }

    if (!response) return <TextCenter text='User not found' />

    return (
        <>
            <ConfirmationPopup />
            <div className='pt-32 align-middle'>
                <div className='m-auto mb-16 flex flex-col items-center gap-2 pt-20'>
                    {response.image ? (
                        <Image
                            src={response.image}
                            alt={response.name || ''}
                            width={75}
                            height={75}
                            className='rounded-full'
                        />
                    ) : (
                        <BsPerson className='h-[75px] w-[75px]' />
                    )}
                    <p className='text-lg'>{response.name}</p>
                    <div className='flex'>
                        <p className='text-lg'>{response.email}</p>
                        {response.emailVerified && <Popper />}
                    </div>
                    {session?.user.id === params.id && (
                        <>
                            <Link
                                href='/update'
                                className='text-gray-400 underline hover:opacity-70'
                            >
                                Update profile
                            </Link>
                            {session.user.type !== 'oauth' && (
                                <Link
                                    href='/update-password'
                                    className='text-gray-400 underline hover:opacity-70'
                                >
                                    Update password
                                </Link>
                            )}
                            <UserDeleteButton />
                        </>
                    )}
                </div>
                <PostsList
                    getPosts={getPostsByAuthor}
                    queryName='postsByAuthor'
                />
            </div>
        </>
    )
}
export default User
