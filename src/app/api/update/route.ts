import { verifyJwt } from '@/lib/jwt'
import { prisma } from '@/lib/prismadb'
import { uploadFile } from '@/lib/utils'
import { JwtPayload } from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
    const body = await request.formData()

    const response = await uploadFile(body.get('file') as File)
    console.log('🚀 ~ file: route.ts:11 ~ POST ~ response:', response)

    const accessToken = request.headers.get('authorization')

    if (!accessToken || !verifyJwt(accessToken.split(' ')[1])) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = verifyJwt(accessToken.split(' ')[1]) as JwtPayload

    const exist = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!exist) {
        return new NextResponse('No user found', { status: 404 })
    }

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            name: body.get('name') as string,
            email: body.get('email') as string
            // image,
        }
    })

    const { hashedPassword, ...result } = user
    return new NextResponse(JSON.stringify(result))
}
