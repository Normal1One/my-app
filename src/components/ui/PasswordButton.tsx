import { FieldError } from 'react-hook-form'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

interface Props {
    isHidden: boolean
    isInvalid: FieldError | undefined
    handleClick: () => void
}

const PasswordButton = ({ isHidden, isInvalid, handleClick }: Props) => {
    return (
        <button
            type='button'
            onClick={() => handleClick()}
            className={`rounded-r border-b border-r border-t pr-3 transition ${
                isInvalid
                    ? 'border-rose-600 bg-rose-200'
                    : 'border-gray-400 bg-gray-200'
            }`}
        >
            {isHidden ? (
                <BsEyeSlash className='h-5 w-5 fill-gray-400 hover:opacity-70' />
            ) : (
                <BsEye className='h-5 w-5 fill-gray-400 hover:opacity-70' />
            )}
        </button>
    )
}

export default PasswordButton
