import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const { password, newPassword, id } = body

    if (!password || !newPassword) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user || !user.hashedPassword) {
        return new NextResponse('No user found', { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword)

    if (!passwordMatch) {
        return new NextResponse('Incorrect password', { status: 401 })
    }

    const changeUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            hashedPassword: await bcrypt.hash(newPassword, 10)
        }
    })

    const { hashedPassword, ...result } = changeUser
    return new Response(JSON.stringify(result))
}
