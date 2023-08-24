interface Props {
    text: string
    htmlFor: string
}

const Label = ({ text, htmlFor }: Props) => {
    return (
        <label htmlFor={htmlFor} className='mb-2 text-sm'>
            {text}
        </label>
    )
}

export default Label
