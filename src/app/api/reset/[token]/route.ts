import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
    request: NextRequest,
    { params }: { params: { token: string } }
) => {
    const body = await request.json()
    const { newPassword } = body

    if (!newPassword) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const { id } = verifyJwt(params.token) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user || !user?.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
    }

    if (!user.resetToken) {
        return new NextResponse('Reset token has been revoked', {
            status: 401
        })
    }

    await prisma.user.update({
        where: {
            id
        },
        data: {
            hashedPassword: await bcrypt.hash(newPassword, 10),
            resetToken: null,
            emailVerified: new Date()
        }
    })

    return new NextResponse('Password updated successfully', {
        status: 200
    })
}
