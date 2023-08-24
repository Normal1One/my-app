import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'
import Label from './Label'
import PasswordInput from './PasswordInput'
import { ReactNode } from 'react'

interface Props {
    isHidden: boolean
    text: string
    id: string
    isError: FieldError | undefined
    register: UseFormRegisterReturn
    rest?: ReactNode
    handleClick: (arg0: string) => void
}

const PasswordInputGroup = ({
    isHidden,
    text,
    handleClick,
    id,
    isError,
    register,
    rest
}: Props) => {
    return (
        <>
            {rest ? (
                <div className='flex justify-between'>
                    <Label text={text} htmlFor={id} />
                    {rest}
                </div>
            ) : (
                <Label text={text} htmlFor={id} />
            )}
            <PasswordInput
                isHidden={isHidden}
                id={id}
                isError={isError}
                register={register}
                handleClick={handleClick}
            />
            <ErrorMessage message={isError?.message} />
        </>
    )
}

export default PasswordInputGroup
