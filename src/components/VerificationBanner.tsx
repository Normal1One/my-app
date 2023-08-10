'use client'

import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsX } from 'react-icons/bs'

const VerificationBanner = () => {
    const { data } = useSession()
    const [defaultValuesSet, setDefaultValuesSet] = useState(false)
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!defaultValuesSet && data) {
            if (
                data?.user.provider === 'credentials' &&
                !data.user.emailVerified
            ) {
                setShow(true)
            }
            setDefaultValuesSet(true)
        }
    }, [data, defaultValuesSet])

    return (
        <section className='bg-rose-600'>
            {show && (
                <div className='m-auto flex h-8 max-w-7xl items-center justify-around'>
                    <BsX
                        className='h-8 w-8 cursor-pointer hover:opacity-80'
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
                        className='hover:opacity-80'
                    >
                        Resent verification email
                    </button>
                </div>
            )}
        </section>
    )
}

export default VerificationBanner
