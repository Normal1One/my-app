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
        },
        include: {
            likedBy: true
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    if (post.authorId !== user.id)
        return new NextResponse("You can't delete other user's post", {
            status: 403
        })

    await Promise.all(
        post.likedBy.map(async (user) => {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    likedPostIDs: {
                        set: user.likedPostIDs.filter((id) => id !== post.id)
                    }
                }
            })
        })
    )

    await prisma.post.delete({
        where: {
            id: post.id
        }
    })

    return new NextResponse('Post deleted successfully')
}

export const GET = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const post = await prisma.post.findUnique({
        where: {
            id: params.id
        },
        include: {
            author: {
                select: {
                    name: true,
                    image: true
                }
            }
        }
    })

    if (!post) return new NextResponse('No post found', { status: 404 })

    return new NextResponse(JSON.stringify(post))
}
