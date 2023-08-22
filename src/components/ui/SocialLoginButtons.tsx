import { signIn } from 'next-auth/react'
import { BsGithub, BsGoogle, BsTwitter } from 'react-icons/bs'
import Divider from './Divider'

const SocialLoginButtons = () => {
    return (
        <>
            <Divider />
            <div className='flex flex-col gap-4'>
                <button
                    className='m-auto flex w-full flex-row place-content-center items-center rounded border border-gray-400 pb-3 pt-3 hover:bg-gray-200 focus:outline-none'
                    type='button'
                    onClick={() =>
                        signIn('github', {
                            redirect: true,
                            callbackUrl: '/'
                        })
                    }
                >
                    Continue with GitHub <BsGithub className='ml-4' />
                </button>
                <button
                    className='m-auto flex w-full flex-row place-content-center items-center rounded border border-gray-400 pb-3 pt-3 hover:bg-gray-200 focus:outline-none'
                    type='button'
                    onClick={() =>
                        signIn('google', {
                            redirect: true,
                            callbackUrl: '/'
                        })
                    }
                >
                    Continue with Google <BsGoogle className='ml-4' />
                </button>
                <button
                    className='m-auto flex w-full flex-row place-content-center items-center rounded border border-gray-400 pb-3 pt-3 hover:bg-gray-200 focus:outline-none'
                    type='button'
                    onClick={() =>
                        signIn('twitter', {
                            redirect: true,
                            callbackUrl: '/'
                        })
                    }
                >
                    Continue with Twitter <BsTwitter className='ml-4' />
                </button>
            </div>
        </>
    )
}

export default SocialLoginButtons
