const Label = ({ text, htmlFor }: { text: string; htmlFor: string }) => {
    return (
        <label htmlFor={htmlFor} className='mb-2 text-sm'>
            {text}
        </label>
    )
}

export default Label
