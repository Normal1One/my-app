import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { uploadFile } from '@/lib/utils'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const PATCH = async (request: NextRequest) => {
    const body = await request.formData()
    const file = body.get('file') as File

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

    if (file && file.size > 4 * 1024 * 1024)
        return new NextResponse('File size is too big', { status: 413 })

    const hashPassword = async () => {
        const newPassword = body.get('newPassword')

        if (newPassword) return await bcrypt.hash(newPassword as string, 10)
    }

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            name: (body.get('name') as string) ?? undefined,
            email: (body.get('email') as string) ?? undefined,
            hashedPassword: await hashPassword(),
            image: (await uploadFile(file))?.data.publicUrl
        }
    })

    const { hashedPassword, ...result } = user
    return new NextResponse(JSON.stringify(result))
}

export const DELETE = async (request: NextRequest) => {
    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken))
        return new NextResponse('Unauthorized', { status: 401 })

    const { id } = verifyJwt(accessToken) as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        },
        include: {
            likedPosts: true
        }
    })

    if (!user) return new NextResponse('No user found', { status: 404 })

    await Promise.all(
        user.likedPosts.map(async (post) => {
            await prisma.post.update({
                where: {
                    id: post.id
                },
                data: {
                    likedByIDs: {
                        set: post.likedByIDs.filter((id) => id !== user.id)
                    }
                }
            })
        })
    )

    await prisma.user.delete({
        where: {
            id: user.id
        }
    })

    return new NextResponse('User deleted successfully')
}
