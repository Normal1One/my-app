import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const PUT = async (
    request: NextRequest,
    { params }: { params: { token: string } }
) => {
    const { newPassword } = await request.json()

    const { id } = jwt.verify(
        params.token,
        process.env.SECRET_KEY!
    ) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user || !user?.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
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

    return new NextResponse('Password updated successfully', { status: 200 })
}
