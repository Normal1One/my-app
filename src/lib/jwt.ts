import jwt, { JwtPayload } from 'jsonwebtoken'

export const signJwtAccessToken = (payload: JwtPayload) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: '1d'
    })
    const refreshToken = jwt.sign(payload, process.env.SECRET_KEY!, {
        expiresIn: '30d'
    })
    return { accessToken, refreshToken }
}

export const verifyJwt = (token: string) => {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!)
    return decoded as JwtPayload
}
