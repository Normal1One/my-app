import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { Post } from '@prisma/client'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
    const take = request.nextUrl.searchParams.get('take')
    const lastCursor = request.nextUrl.searchParams.get('lastCursor')

    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken))
        return new NextResponse('Unauthorized', { status: 401 })

    const { id } = verifyJwt(accessToken) as JwtPayload

    const exist = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!exist) return new NextResponse('No user found', { status: 404 })

    const posts = await prisma.post.findMany({
        where: {
            likedByIDs: {
                has: id
            }
        },
        take: take ? parseInt(take as string) : 10,
        ...(lastCursor && {
            skip: 1,
            cursor: {
                id: lastCursor as string
            }
        }),
        orderBy: {
            createdAt: 'desc'
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

    if (posts.length == 0) {
        return new NextResponse(
            JSON.stringify({
                posts: [],
                metaData: {
                    lastCursor: null,
                    hasNextPage: false
                }
            })
        )
    }

    const lastPostInResults: Post = posts[posts.length - 1]
    const cursor: string = lastPostInResults.id

    const nextPosts = await prisma.post.findMany({
        where: {
            likedByIDs: {
                has: id
            }
        },
        take: take ? parseInt(take as string) : 7,
        skip: 1,
        cursor: {
            id: cursor
        },
        orderBy: {
            createdAt: 'desc'
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

    const data = {
        data: posts,
        metaData: {
            lastCursor: cursor,
            hasNextPage: nextPosts.length > 0
        }
    }

    return new NextResponse(JSON.stringify(data))
}
