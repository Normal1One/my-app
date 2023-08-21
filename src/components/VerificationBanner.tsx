'use client'

import { signIn, useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'

const VerificationBanner = ({
    show,
    setShow
}: {
    show: boolean
    setShow: (arg0: boolean) => void
}) => {
    const { data } = useSession()

    if (!show) return

    return (
        <div className='bg-rose-600'>
            <div className='m-auto flex h-8 max-w-7xl items-center justify-around'>
                <BsX
                    className='h-8 w-8 cursor-pointer hover:opacity-70'
                    onClick={() => setShow(false)}
                />
                <p>Please verify your email - {data?.user.email}</p>
                <button
                    onClick={() => {
                        signIn('email', {
                            redirect: false,
                            callbackUrl: '/',
                            email: data?.user.email
                        })
                        toast.success(
                            `Email sent to ${data?.user.email}, please check your email`
                        )
                    }}
                    className='hover:opacity-70'
                >
                    Resent verification email
                </button>
            </div>
        </div>
    )
}

export default VerificationBanner
