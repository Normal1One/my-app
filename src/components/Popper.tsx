'use client'

import { Tooltip } from 'react-tooltip'
import { BsAward } from 'react-icons/bs'

const Popper = () => {
    return (
        <>
            <BsAward
                data-tooltip-id='badge'
                data-tooltip-place='right'
                data-tooltip-content='Email is verified'
                className='ml-3 self-center'
            />
            <Tooltip id='badge' />
        </>
    )
}

export default Popper
