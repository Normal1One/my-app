import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const PUT = async (
    request: NextRequest,
    { params }: { params: { token: string } }
) => {
    const body = await request.json()
    const { password, newPassword } = body

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

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
        return new NextResponse('Incorrect password', { status: 401 })
    }

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            hashedPassword: await bcrypt.hash(newPassword, 10),
            resetToken: null,
            emailVerified: new Date()
        }
    })

    return new NextResponse('Password updated successfully', { status: 200 })
}
