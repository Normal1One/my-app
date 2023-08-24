interface Props {
    text: string
}

const TextCenter = ({ text }: Props) => {
    return (
        <div className='absolute top-1/2 w-full text-center text-lg'>
            {text}
        </div>
    )
}

export default TextCenter
