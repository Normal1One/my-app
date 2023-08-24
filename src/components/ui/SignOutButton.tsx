'use client'

import { signOut } from 'next-auth/react'
import React from 'react'

const SignOutButton = () => {
    return (
        <button
            onClick={() =>
                signOut({
                    redirect: true,
                    callbackUrl: '/'
                })
            }
            className='hover:opacity-70'
        >
            Sign Out
        </button>
    )
}

export default SignOutButton
