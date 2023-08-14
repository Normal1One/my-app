import { verifyJwt } from '@/lib/jwt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const { refresh } = body

    if (!refresh) return new NextResponse('Missing fields', { status: 400 })

    try {
        const { iat, exp, ...result } = verifyJwt(refresh) as JwtPayload

        const accessToken = jwt.sign(result, process.env.SECRET_KEY!, {
            expiresIn: '24h'
        })

        return new NextResponse(JSON.stringify({ accessToken }))
    } catch (error) {
        return new NextResponse(JSON.stringify(error), { status: 401 })
    }
}
