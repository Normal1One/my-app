import { AuthGetApi } from '@/lib/fetchAPI'
import Image from 'next/image'

const User = async ({ params }: { params: { id: string } }) => {
    const response = await AuthGetApi(`api/user/${params.id}`)

    return (
        <section className='flex h-[calc(100vh-64px)] align-middle'>
            <div className='m-auto flex w-[20rem] flex-col items-center rounded bg-gray-300 p-7 dark:bg-gray-700'>
                <Image
                    src={response.image}
                    alt={response.name}
                    width={75}
                    height={75}
                    className='mb-6 rounded-full'
                />
                <p className='text-lg'>{response.name}</p>
            </div>
        </section>
    )
}

export default User
