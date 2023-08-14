import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
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

    if (!user) return new NextResponse('No user found', { status: 404 })

    const post = await prisma.post.findUnique({
        where: {
            id: params.id
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    if (post.likedByIDs.includes(user.id))
        return new NextResponse('Post is already liked', { status: 409 })

    const likedPost = await prisma.post.update({
        where: {
            id: post.id
        },
        data: {
            likedBy: {
                connect: {
                    id: user.id
                }
            }
        }
    })

    return new NextResponse(JSON.stringify(likedPost))
}

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
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

    if (!user) return new NextResponse('No user found', { status: 404 })

    const post = await prisma.post.findUnique({
        where: {
            id: params.id
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    if (!post.likedByIDs.includes(user.id))
        return new NextResponse('Post is already unliked', { status: 400 })

    const unlikedPost = await prisma.post.update({
        where: {
            id: post.id
        },
        data: {
            likedBy: {
                disconnect: {
                    id: user.id
                }
            }
        }
    })

    return new NextResponse(JSON.stringify(unlikedPost))
}
