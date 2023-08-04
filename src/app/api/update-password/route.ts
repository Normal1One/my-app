import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const { password, newPassword } = body

    if (!password || !newPassword) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken)) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = verifyJwt(accessToken) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user || !user?.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
        return new NextResponse('Incorrect password', { status: 401 })
    }

    await prisma.user.update({
        where: {
            id
        },
        data: {
            hashedPassword: await bcrypt.hash(newPassword, 10)
        }
    })

    return new NextResponse('User updated successfully')
}
