import { ReactNode } from 'react'

interface Props {
    children: ReactNode
    onSubmit: () => void
}

const Form = ({ children, onSubmit }: Props) => {
    return (
        <form
            className='m-auto flex w-96 flex-col gap-2'
            onSubmit={onSubmit}
            noValidate
        >
            {children}
        </form>
    )
}

export default Form
