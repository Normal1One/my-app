import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface Props {
    type: string
    placeholder?: string
    id: string
    isError: FieldError | undefined
    register: UseFormRegisterReturn
}

const Input = ({ type, placeholder, id, isError, register }: Props) => {
    return (
        <input
            className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                isError && 'border-rose-600 bg-rose-200 placeholder-rose-600'
            }`}
            type={type}
            placeholder={placeholder}
            id={id}
            {...register}
        />
    )
}

export default Input
