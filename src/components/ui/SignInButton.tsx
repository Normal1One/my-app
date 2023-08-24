'use client'

import { signIn } from 'next-auth/react'
import React from 'react'

const SignInButton = () => {
    return (
        <button className='hover:opacity-70' onClick={() => signIn()}>
            Sign In
        </button>
    )
}

export default SignInButton
