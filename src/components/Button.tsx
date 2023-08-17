const Button = ({
    text,
    loadingText,
    isLoading,
    extras
}: {
    text: string
    loadingText: string
    isLoading: boolean
    extras?: any
}) => {
    return (
        <button
            className={`w-full rounded pb-3 pt-3 text-white ${
                isLoading ? 'bg-gray-200' : 'bg-gray-400 hover:opacity-70'
            }`}
            type='submit'
            disabled={isLoading}
            {...extras}
        >
            {isLoading ? loadingText : text}
        </button>
    )
}

export default Button
