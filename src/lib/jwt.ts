import jwt, { JwtPayload } from 'jsonwebtoken'

export function signJwtAccessToken(payload: JwtPayload) {
    const token = jwt.sign(payload, process.env.SECRET_KEY!)
    return token
}

export function verifyJwt(token: string) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!)
    return decoded as JwtPayload
}
