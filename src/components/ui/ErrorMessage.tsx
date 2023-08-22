const ErrorMessage = ({ message }: { message: string | undefined }) => {
    return <p className='text-xs text-rose-600'>{message}</p>
}

export default ErrorMessage
