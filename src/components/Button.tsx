const Button = ({ text }: { text: string }) => {
    return (
        <button
            className='w-full rounded bg-gray-400 pb-3 pt-3 text-white hover:opacity-80'
            type='submit'
        >
            {text}
        </button>
    )
}

export default Button
