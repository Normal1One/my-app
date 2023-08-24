import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import PasswordButton from './PasswordButton'

interface Props {
    isHidden: boolean
    id: string
    isError: FieldError | undefined
    register: UseFormRegisterReturn
    handleClick: (arg0: string) => void
}

const PasswordInput = ({
    isHidden,
    id,
    isError,
    register,
    handleClick
}: Props) => {
    return (
        <div className='flex'>
            <input
                className={`w-full rounded-l border-b border-l border-t border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                    isError &&
                    'border-rose-600 bg-rose-200 placeholder-rose-600'
                }`}
                type={isHidden ? 'text' : 'password'}
                placeholder='••••••••'
                id={id}
                {...register}
            />
            <PasswordButton
                isHidden={isHidden}
                isInvalid={isError}
                handleClick={() => handleClick(id)}
            />
        </div>
    )
}

export default PasswordInput
