import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import Label from './Label'
import ErrorMessage from './ErrorMessage'

interface Props {
    text: string
    id: string
    isError: FieldError | undefined
    register: UseFormRegisterReturn
}

const TextareaGroup = ({ text, id, isError, register }: Props) => {
    return (
        <>
            <Label text={text} htmlFor={id} />
            <textarea
                className={`rounded border border-gray-400 bg-gray-200 p-3 transition focus:shadow-md focus:outline-none ${
                    isError &&
                    'border-rose-600 bg-rose-200 placeholder-rose-600'
                }`}
                rows={10}
                cols={50}
                id='text'
                {...register}
            />
            <ErrorMessage message={isError?.message} />
        </>
    )
}

export default TextareaGroup
