import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Header from '@/components/Header'
import Popper from '@/components/Popper'
import { AuthGetApi } from '@/lib/fetchAPI'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { BsPerson } from 'react-icons/bs'

const User = async ({ params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions)
    const response = await AuthGetApi(`api/users/${params.id}`)

    return (
        <section>
            <Header />
            <div className='flex h-[calc(100vh-64px)] align-middle'>
                <div className='m-auto flex flex-col items-center gap-2'>
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
                        <Link
                            href='/update'
                            className='text-gray-400 underline hover:opacity-80'
                        >
                            Update Profile
                        </Link>
                    )}
                </div>
            </div>
        </section>
    )
}

export default User
