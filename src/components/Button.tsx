const Button = ({
    isLoading,
    onClick
}: {
    isLoading: boolean
    onClick?: () => void
}) => {
    return (
        <button
            className={`w-full rounded pb-3 pt-3 text-white ${
                isLoading ? 'bg-gray-200' : 'bg-gray-400 hover:opacity-70'
            }`}
            type='submit'
            disabled={isLoading}
            onClick={onClick}
        >
            {isLoading ? 'Submitting...' : 'Submit'}
        </button>
    )
}

export default Button
