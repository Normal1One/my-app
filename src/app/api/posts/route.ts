import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.json()

    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken))
        return new NextResponse('Unauthorized', { status: 401 })

    const { title, text } = body

    if (!title || !text)
        return new NextResponse('Missing fields', { status: 400 })

    const { id } = verifyJwt(accessToken) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return new NextResponse('No user found', { status: 404 })

    const post = await prisma.post.create({
        data: {
            title,
            text,
            author: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    return new NextResponse(JSON.stringify(post))
}

export const GET = async () => {
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return new NextResponse(JSON.stringify(posts))
}
