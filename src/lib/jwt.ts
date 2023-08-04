import jwt, { JwtPayload } from 'jsonwebtoken'

export const signJwtAccessToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: '24h'
    })
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: '30d'
    })
    return { accessToken, refreshToken }
}

export const verifyJwt = (token: string) => {
    try {
        const decoded = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.SECRET_KEY!
        )
        return decoded as JwtPayload
    } catch (error) {
        console.error(error)
    }
}
