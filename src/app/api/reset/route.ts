import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prismadb'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export const POST = async (request: NextRequest) => {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { password, newPassword } = body

    if (!password || !newPassword) {
        return new NextResponse('Missing fields', { status: 400 })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session?.user.id
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
            id: session?.user.id
        },
        data: {
            hashedPassword: await bcrypt.hash(newPassword, 10)
        }
    })

    const { hashedPassword, ...result } = changeUser
    return new Response(JSON.stringify(result))
}
