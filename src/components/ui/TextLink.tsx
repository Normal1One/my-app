import Link from 'next/link'

const TextLink = ({
    text,
    linkText,
    link
}: {
    text: string
    linkText: string
    link: string
}) => {
    return (
        <p className='self-center text-sm'>
            {text}
            <Link
                href={link}
                className='text-gray-400 underline hover:opacity-70'
            >
                {linkText}
            </Link>
        </p>
    )
}

export default TextLink
