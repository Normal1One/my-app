import { ReactNode } from 'react'

const Form = ({
    children,
    onSubmit
}: {
    children: ReactNode
    onSubmit: () => void
}) => {
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
