'use client'

import { MouseEvent, useRef, useState } from 'react'
import { BsX } from 'react-icons/bs'
import Button from './Button'

const ConfirmationPopup = () => {
    const [show, setShow] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const handleClick = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setShow(false)
        }
    }

    if (!show) return

    return (
        <div
            className='fixed z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-40'
            onClick={(event) => handleClick(event)}
        >
            <div className='relative w-[360px] rounded bg-white p-5' ref={ref}>
                <BsX
                    className='absolute right-2 top-2 h-8 w-8 cursor-pointer hover:opacity-70'
                    onClick={() => setShow(false)}
                />
                <p className='mb-5 text-center text-lg'>Are you sure?</p>
                <Button
                    text='Delete'
                    loadingText='Deleting...'
                    isLoading={false}
                    extras={"type='button'"}
                />
            </div>
        </div>
    )
}

export default ConfirmationPopup
