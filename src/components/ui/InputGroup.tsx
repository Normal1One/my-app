import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import ErrorMessage from './ErrorMessage'
import Input from './Input'
import Label from './Label'

interface Props {
    type: string
    text: string
    placeholder?: string
    id: string
    isError: FieldError | undefined
    register: UseFormRegisterReturn
}

const InputGroup = ({
    type,
    text,
    placeholder,
    id,
    isError,
    register
}: Props) => {
    return (
        <>
            <Label text={text} htmlFor={id} />
            <Input
                type={type}
                placeholder={placeholder}
                id={id}
                isError={isError}
                register={register}
            />
            <ErrorMessage message={isError?.message} />
        </>
    )
}

export default InputGroup
