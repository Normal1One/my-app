import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken))
        return new NextResponse('Unauthorized', { status: 401 })

    const { id } = verifyJwt(accessToken) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) return new NextResponse('No user found', { status: 404 })

    const post = await prisma.post.findUnique({
        where: {
            id: params.id
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    await prisma.post.delete({
        where: {
            id: post.id
        }
    })

    return new NextResponse(JSON.stringify([]))
}

export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const post = await prisma.post.findUnique({
        where: {
            id: params.id
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    return new NextResponse(JSON.stringify(post))
}
