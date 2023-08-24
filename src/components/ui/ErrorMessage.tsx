interface Props {
    message: string | undefined
}

const ErrorMessage = ({ message }: Props) => {
    return <p className='text-xs text-rose-600'>{message}</p>
}

export default ErrorMessage
