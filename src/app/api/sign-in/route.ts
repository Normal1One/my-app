import { signJwtAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user || !user?.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
        return new NextResponse('Incorrect password', { status: 401 })
    }

    const { hashedPassword, ...result } = user
    const { accessToken, refreshToken } = signJwtAccessToken(result)
    return new NextResponse(
        JSON.stringify({ ...result, accessToken, refreshToken })
    )
}
