const Button = ({
    text,
    loadingText,
    isLoading
}: {
    text: string
    loadingText: string
    isLoading: boolean
}) => {
    return (
        <button
            className={`w-full rounded pb-3 pt-3 text-white ${
                isLoading ? 'bg-gray-200' : 'bg-gray-400 hover:opacity-80'
            }`}
            type='submit'
            disabled={isLoading}
        >
            {isLoading ? loadingText : text}
        </button>
    )
}

export default Button
